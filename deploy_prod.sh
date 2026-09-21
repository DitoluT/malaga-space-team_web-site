#!/bin/bash

# Despliegue de PRODUCCIÓN en spaceteam.uma.es con todo en Docker
# (nginx, backend de inventario y LinkStack en /social). El TLS lo termina el proxy
# inverso de la UMA, que reenvía por HTTP al puerto 80 de este servidor.
#
#   ./deploy_prod.sh              Despliega la rama actual (debe estar commiteada)
#   ./deploy_prod.sh --rollback   Vuelve al Apache del host (para nginx de Docker)
#
# Qué hace, en orden, y sin cortar el servicio hasta el último paso:
#   1. Envía la rama actual al repo del servidor (git bundle, sin pasar por GitHub).
#   2. Completa el .env del servidor (JWT_SECRET aleatorio y la contraseña de
#      LinkStack de tu .env local).
#   3. Copia de seguridad de data/inventory.db.
#   4. Construye las imágenes y levanta el stack en 127.0.0.1:8080 (ensayo).
#   5. Si el ensayo pasa: para el Apache del host y publica nginx en el puerto 80.
#      Si la comprobación final (local o pública) falla, deshace el cambio solo.
#
# Conexión: la misma que el alias `space` (entrada spaceteam.uma.es de ~/.ssh/config).

set -euo pipefail

SSH_HOST="${SSH_HOST:-spaceteam.uma.es}"
REMOTE_DIR="${REMOTE_DIR:-/root/malaga-space-team_web-site}"
DOMAIN="${DOMAIN:-spaceteam.uma.es}"
COMPOSE="docker compose -f docker-compose.yml -f docker-compose.prod.yml"

cd "$(dirname "$0")"

if [ "${1:-}" = "--rollback" ]; then
  echo "↩️  Volviendo al Apache del host..."
  ssh "$SSH_HOST" "cd '$REMOTE_DIR' && $COMPOSE stop frontend && systemctl enable --now httpd && echo 'Apache del host activo de nuevo.'; [ -f /root/load_website.sh.apache-bak ] && cp -p /root/load_website.sh.apache-bak /root/load_website.sh"
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
BASE="$(ssh "$SSH_HOST" "git -C '$REMOTE_DIR' rev-parse HEAD")"
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

ssh "$SSH_HOST" "REMOTE_DIR='$REMOTE_DIR' BRANCH='$BRANCH' DOMAIN='$DOMAIN' COMPOSE='$COMPOSE' bash -s" <<'REMOTE'
set -euo pipefail
cd "$REMOTE_DIR"

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
sed -i '/^TLS_/d' .env

echo "💾 [3/5] Copia de seguridad de la base de datos..."
if [ -f data/inventory.db ]; then
  cp -p data/inventory.db "data/inventory.db.bak-$(date +%Y%m%d-%H%M%S)"
fi

# El proxy de la UMA entra por HTTP a la IPv6 global del servidor: se prueba por ahí
ADDR6="$(ip -6 -o addr show scope global | awk '{print $4}' | cut -d/ -f1 | grep -v '^2001:db8' | head -1)"
[ -n "$ADDR6" ] && BASE_HOST="[$ADDR6]" || BASE_HOST="127.0.0.1"
echo "   Las comprobaciones locales usan http://$BASE_HOST"

check() { # check <puerto> : web, /social (con URLs https) y API, como las pediría el proxy de la UMA
  local p="$1" ok=0 url
  for i in $(seq 1 30); do
    ok=1
    for url in / /social/ /api/web/team; do
      code=$(curl -g -s -o /dev/null -w '%{http_code}' --max-time 10 -H "Host: $DOMAIN" "http://$BASE_HOST:$p$url" || true)
      [ "$code" = "200" ] || ok=0
    done
    page="$(curl -g -s --max-time 10 -H "Host: $DOMAIN" "http://$BASE_HOST:$p/social/" || true)"
    # (here-strings: con pipefail, `echo | grep -q` falla por SIGPIPE aunque haya coincidencia)
    grep -q "linkedin.com/company/malaga-space-team" <<<"$page" || ok=0
    grep -q "https://$DOMAIN/social/" <<<"$page" || ok=0
    [ "$ok" = 1 ] && return 0
    sleep 2
  done
  return 1
}

echo "🏗️  [4/5] Construyendo imágenes y ensayando en el puerto 8080 (la web sigue en Apache)..."
$COMPOSE build -q </dev/null
# 8080 no está abierto en firewalld: solo es alcanzable desde el propio servidor
HTTP_PORT=8080 $COMPOSE up -d --remove-orphans </dev/null
if ! check 8080; then
  echo "   ❌ El ensayo ha fallado. No se toca Apache. Revisa: $COMPOSE logs"
  $COMPOSE stop frontend </dev/null
  exit 1
fi
echo "   Ensayo OK (web, /social y API responden)."
if docker exec malaga-frontend nc -z -w 3 host.docker.internal 4000; then
  echo "   El servicio /reload del host (puerto 4000) es alcanzable desde nginx."
else
  echo "   ⚠️  nginx no alcanza el puerto 4000 del host: /reload no funcionará (no bloquea el despliegue)."
fi

echo "🚀 [5/5] Cambio: Apache del host -> nginx en Docker..."
# El contenedor definitivo (puerto 80) se deja creado antes de parar Apache:
# así el hueco sin servicio es de ~1 s y el proxy de la UMA apenas lo nota
$COMPOSE up --no-start </dev/null
systemctl stop httpd
docker start malaga-frontend >/dev/null
if check 80; then
  echo "   nginx de Docker sirviendo en el puerto 80."
else
  echo "   ❌ La comprobación final ha fallado: se restaura Apache."
  $COMPOSE stop frontend </dev/null
  systemctl start httpd
  exit 1
fi
REMOTE

echo "🌍 Comprobando desde fuera (a través del proxy de la UMA)..."
# El proxy de la UMA puede marcar el servidor como caído unos segundos tras el microcorte
# del cambio y responder 503 sin reintentar: se insiste hasta 2 minutos antes de deshacer.
PUBLIC_OK=0
for attempt in $(seq 1 24); do
  PUBLIC_OK=1
  for url in "https://$DOMAIN/" "https://$DOMAIN/social/" "https://$DOMAIN/inventario" "https://$DOMAIN/api/web/team"; do
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$url" || true)"
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
  echo "❌ La comprobación pública ha fallado: se restaura el Apache del host."
  ssh "$SSH_HOST" "cd '$REMOTE_DIR' && $COMPOSE stop frontend && systemctl start httpd"
  exit 1
fi
ssh "$SSH_HOST" "
  systemctl disable -q httpd
  docker image prune -f >/dev/null
  # /reload: el script antiguo borraba /var/www/html y copiaba dist/ (que ya no existe)
  [ -f /root/load_website.sh ] && [ ! -f /root/load_website.sh.apache-bak ] && cp -p /root/load_website.sh /root/load_website.sh.apache-bak
  printf '#!/bin/bash\\nexec $REMOTE_DIR/reload_website.sh\\n' > /root/load_website.sh
  chmod 755 /root/load_website.sh
"
echo "   Apache del host parado y deshabilitado (su configuración queda intacta)."
echo "   /reload ahora ejecuta reload_website.sh (git pull + docker compose up --build)."
echo "✅ Desplegado. Panel de enlaces: https://$DOMAIN/social/login"
echo "   Si algo va mal: ./deploy_prod.sh --rollback"
