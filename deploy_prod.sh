#!/bin/bash

# Despliegue de PRODUCCIÓN en spaceteam.uma.es (todo en Docker: nginx con la web y los
# paneles, backend de inventario y LinkStack en /social).
#
#   ./deploy_prod.sh              Despliega la rama actual (debe estar commiteada)
#   ./deploy_prod.sh --rollback   Vuelve a la versión anterior del frontend
#
# Delante del servidor está el proxy de la UMA, que reenvía https:// al puerto 443 y
# http:// al 80 y vigila ambos: nginx sirve los dos con el certificado del servidor.
#
# Qué hace, en orden:
#   1. Envía la rama actual al repo del servidor (git bundle, sin pasar por GitHub).
#   2. Completa el .env del servidor (JWT_SECRET, rutas del certificado, LinkStack).
#   3. Copia de seguridad de data/inventory.db.
#   4. Construye las imágenes. La web sigue en marcha; si el build falla, no se toca nada.
#   5. Guarda la imagen actual como «anterior», actualiza los contenedores y comprueba
#      en local y desde fuera. Si algo falla, vuelve sola a la imagen anterior.
#
# Conexión: la misma que el alias `space` (entrada spaceteam.uma.es de ~/.ssh/config).

set -euo pipefail

SSH_HOST="${SSH_HOST:-spaceteam.uma.es}"
REMOTE_DIR="${REMOTE_DIR:-/root/malaga-space-team_web-site}"
DOMAIN="${DOMAIN:-spaceteam.uma.es}"
COMPOSE="docker compose -f docker-compose.yml -f docker-compose.prod.yml"
FRONTEND_IMAGE="malaga-space-team_web-site-frontend"

cd "$(dirname "$0")"

# Vuelve a la imagen anterior del frontend (la guarda cada despliegue) y la arranca
ROLLBACK_CMD="cd '$REMOTE_DIR' && docker image inspect $FRONTEND_IMAGE:previous >/dev/null && docker tag $FRONTEND_IMAGE:previous $FRONTEND_IMAGE:latest && $COMPOSE up -d --no-build --force-recreate --no-deps frontend"

if [ "${1:-}" = "--rollback" ]; then
  echo "↩️  Volviendo a la versión anterior del frontend..."
  ssh "$SSH_HOST" "$ROLLBACK_CMD" </dev/null
  exit 0
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Error: hay cambios sin commitear. Haz commit antes de desplegar."
  exit 1
fi
if ! grep -q '^LINKSTACK_ADMIN_PASSWORD=.\+' .env 2>/dev/null; then
  echo "Error: define LINKSTACK_ADMIN_PASSWORD en .env (ver .env.example)."
  exit 1
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
COMMIT="$(git rev-parse --short HEAD)"
TMPDIR_DEPLOY="$(mktemp -d)"
BUNDLE="$TMPDIR_DEPLOY/deploy.bundle"
trap 'rm -rf "$TMPDIR_DEPLOY"' EXIT

echo "📦 [1/5] Enviando ${BRANCH} (${COMMIT}) al servidor..."
# Solo los commits que el servidor aún no tiene
BASE="$(ssh "$SSH_HOST" "git -C '$REMOTE_DIR' rev-parse HEAD" </dev/null)"
if [ "$BASE" = "$(git rev-parse HEAD)" ]; then
  echo "   El servidor ya está en ${COMMIT}."
  git bundle create "$BUNDLE" -1 "$BRANCH" >/dev/null 2>&1
elif git cat-file -e "$BASE^{commit}" 2>/dev/null; then
  git bundle create "$BUNDLE" "$BRANCH" --not "$BASE" >/dev/null 2>&1
else
  git bundle create "$BUNDLE" "$BRANCH" >/dev/null 2>&1
fi
scp -q "$BUNDLE" "$SSH_HOST:/tmp/mst-deploy.bundle"
grep -E '^LINKSTACK_' .env | ssh "$SSH_HOST" "umask 077; cat > '$REMOTE_DIR/.env.linkstack.tmp'"

ssh "$SSH_HOST" "REMOTE_DIR='$REMOTE_DIR' BRANCH='$BRANCH' DOMAIN='$DOMAIN' COMPOSE='$COMPOSE' FRONTEND_IMAGE='$FRONTEND_IMAGE' bash -s" <<'REMOTE'
set -euo pipefail
cd "$REMOTE_DIR"

if systemctl is-active -q httpd; then
  echo "   Error: el Apache del host está activo y ocupa los puertos 80/443."
  echo "   Páralo antes (systemctl disable --now httpd) o revisa el estado del servidor."
  exit 1
fi

git fetch -q /tmp/mst-deploy.bundle "$BRANCH:refs/remotes/deploy/$BRANCH"
rm -f /tmp/mst-deploy.bundle
# Los cambios locales del servidor (add_user.sh...) se conservan; si chocaran, git aborta aquí
git checkout -q -B "$BRANCH" "refs/remotes/deploy/$BRANCH"
echo "   Servidor en $(git log -1 --format='%h %s')"

echo "🔑 [2/5] Completando .env del servidor..."
touch .env && chmod 600 .env
setenv() { grep -q "^$1=" .env || echo "$1=$2" >> .env; }
while IFS='=' read -r k v; do [ -n "$k" ] && setenv "$k" "$v"; done < .env.linkstack.tmp
rm -f .env.linkstack.tmp
setenv JWT_SECRET "$(openssl rand -hex 32)"
VHOST=/etc/httpd/conf.d/$DOMAIN.conf
apache_path() { awk -v d="$1" '$1==d {print $2; exit}' "$VHOST"; }
setenv TLS_CERT_FILE "$(apache_path SSLCertificateFile)"
setenv TLS_CHAIN_FILE "$(apache_path SSLCertificateChainFile)"
setenv TLS_KEY_FILE "$(apache_path SSLCertificateKeyFile)"
for k in TLS_CERT_FILE TLS_CHAIN_FILE TLS_KEY_FILE; do
  f="$(grep "^$k=" .env | cut -d= -f2-)"
  [ -f "$f" ] || { echo "   Error: $k no apunta a un fichero existente."; exit 1; }
done

echo "💾 [3/5] Copia de seguridad de la base de datos..."
if [ -f data/inventory.db ]; then
  cp -p data/inventory.db "data/inventory.db.bak-$(date +%Y%m%d-%H%M%S)"
  # se conservan las 10 copias más recientes
  ls -1t data/inventory.db.bak-* 2>/dev/null | tail -n +11 | xargs -r rm -f
fi

# Nota: en esta VM no se puede conectar a la propia IPv6 global desde dentro, así que se
# prueba por loopback IPv4 e IPv6 (el proxy de la UMA entra por IPv6).
# -k: igual que el proxy de la UMA, no se valida el certificado del servidor.
check() { # web, paneles, /social (con URLs https) y API por HTTPS; el puerto 80 solo redirige
  local ok=0 url base
  for i in $(seq 1 20); do
    ok=1
    for base in "https://127.0.0.1" "https://[::1]"; do
      for url in / /en /inventario /admin /social/ /api/web/team; do
        code=$(curl -g -k -s --noproxy '*' -o /dev/null -w '%{http_code}' --max-time 5 -H "Host: $DOMAIN" "$base$url" || true)
        [ "$code" = "200" ] || ok=0
      done
    done
    for base in "http://127.0.0.1" "http://[::1]"; do
      code=$(curl -g -s --noproxy '*' -o /dev/null -w '%{http_code}' --max-time 5 "$base/nginx-health" || true)
      [ "$code" = "200" ] || ok=0
    done
    page="$(curl -g -k -s --noproxy '*' --max-time 5 -H "Host: $DOMAIN" "https://[::1]/social/" || true)"
    # (here-strings: con pipefail, `echo | grep -q` falla por SIGPIPE aunque haya coincidencia)
    grep -q "linkedin.com/company/malaga-space-team" <<<"$page" || ok=0
    grep -q "https://$DOMAIN/social/" <<<"$page" || ok=0
    [ "$ok" = 1 ] && return 0
    sleep 2
  done
  return 1
}

echo "🏗️  [4/5] Construyendo imágenes (la web sigue en marcha)..."
$COMPOSE build -q </dev/null

echo "🚀 [5/5] Actualizando contenedores..."
if [ -n "$(docker ps -q -f name=malaga-frontend)" ]; then
  # imagen que está sirviendo ahora mismo: es a la que se vuelve si algo falla
  docker tag "$(docker inspect -f '{{.Image}}' malaga-frontend)" "$FRONTEND_IMAGE:previous"
fi
$COMPOSE up -d --remove-orphans </dev/null
if check; then
  echo "   Comprobación local OK (web, paneles, /social y API por HTTP y HTTPS, IPv4 e IPv6)."
else
  echo "   ❌ La comprobación local ha fallado: se vuelve a la imagen anterior."
  docker tag "$FRONTEND_IMAGE:previous" "$FRONTEND_IMAGE:latest"
  $COMPOSE up -d --no-build --force-recreate --no-deps frontend </dev/null
  exit 1
fi
REMOTE

echo "🌍 Comprobando desde fuera (a través del proxy de la UMA)..."
# El proxy de la UMA puede marcar el servidor como caído unos segundos tras el reinicio de
# nginx y responder 503 sin reintentar: se insiste hasta 2 minutos antes de deshacer.
PUBLIC_OK=0
for attempt in $(seq 1 24); do
  PUBLIC_OK=1
  for url in "https://$DOMAIN/" "https://$DOMAIN/admin" "https://$DOMAIN/social/" "https://$DOMAIN/inventario" "https://$DOMAIN/api/web/team" "http://$DOMAIN/"; do
    code="$(curl -sL -o /dev/null -w '%{http_code}' --max-time 20 "$url" || true)"
    [ "$code" = "200" ] || { PUBLIC_OK=0; echo "   (intento $attempt) $url -> $code"; break; }
  done
  if [ "$PUBLIC_OK" = 1 ]; then
    PUBLIC_PAGE="$(curl -s --max-time 20 "https://$DOMAIN/social/" || true)"
    grep -q "linkedin.com/company/malaga-space-team" <<<"$PUBLIC_PAGE" && break
    PUBLIC_OK=0
  fi
  sleep 5
done
if [ "$PUBLIC_OK" != 1 ]; then
  echo "❌ La comprobación pública ha fallado: se vuelve a la imagen anterior."
  ssh "$SSH_HOST" "$ROLLBACK_CMD" </dev/null
  exit 1
fi

ssh "$SSH_HOST" "docker image prune -f >/dev/null" </dev/null
echo "✅ Desplegado: https://$DOMAIN/"
echo "   Si algo va mal: ./deploy_prod.sh --rollback"
