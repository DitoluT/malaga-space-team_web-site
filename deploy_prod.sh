#!/bin/bash

# Despliegue de PRODUCCIÓN en spaceteam.uma.es con todo en Docker
# (nginx+TLS, backend de inventario y LinkStack en /social).
#
#   ./deploy_prod.sh              Despliega la rama actual (debe estar commiteada)
#   ./deploy_prod.sh --rollback   Vuelve al Apache del host (para nginx de Docker)
#
# Qué hace, en orden, y sin cortar el servicio hasta el último paso:
#   1. Envía la rama actual al repo del servidor (git bundle, sin pasar por GitHub).
#   2. Completa el .env del servidor (JWT_SECRET aleatorio, rutas del certificado
#      de la UMA leídas del Apache, contraseña de LinkStack de tu .env local).
#   3. Copia de seguridad de data/inventory.db.
#   4. Construye las imágenes y levanta el stack en 127.0.0.1:8080/8443 (ensayo).
#   5. Si el ensayo pasa: para el Apache del host y publica nginx en 80/443.
#      Si la comprobación final falla, deshace el cambio automáticamente.
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
  ssh "$SSH_HOST" "cd '$REMOTE_DIR' && $COMPOSE stop frontend && systemctl enable --now httpd && echo 'Apache del host activo de nuevo.'"
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
VHOST=/etc/httpd/conf.d/$DOMAIN.conf
apache_path() { awk -v d="$1" '$1==d {print $2; exit}' "$VHOST"; }
setenv JWT_SECRET "$(openssl rand -hex 32)"
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
fi

check() { # check <puerto https> : comprueba web, /social y API con el certificado real
  local p="$1" ok=0 url
  for i in $(seq 1 30); do
    ok=1
    for url in / /social/ /api/web/team; do
      code=$(curl -s -o /dev/null -w '%{http_code}' --resolve "$DOMAIN:$p:127.0.0.1" "https://$DOMAIN:$p$url" || true)
      [ "$code" = "200" ] || ok=0
    done
    curl -s --resolve "$DOMAIN:$p:127.0.0.1" "https://$DOMAIN:$p/social/" | grep -q "linkedin.com/company/malaga-space-team" || ok=0
    [ "$ok" = 1 ] && return 0
    sleep 2
  done
  return 1
}

echo "🏗️  [4/5] Construyendo imágenes y ensayando en 127.0.0.1:8443 (la web sigue en Apache)..."
$COMPOSE build -q </dev/null
HTTP_PORT=127.0.0.1:8080 HTTPS_PORT=127.0.0.1:8443 $COMPOSE up -d </dev/null
if ! check 8443; then
  echo "   ❌ El ensayo ha fallado. No se toca Apache. Revisa: $COMPOSE logs"
  $COMPOSE stop frontend </dev/null
  exit 1
fi
echo "   Ensayo OK (TLS válido, web, /social y API responden)."

echo "🚀 [5/5] Cambio: Apache del host -> nginx en Docker..."
systemctl stop httpd
$COMPOSE up -d </dev/null
if check 443; then
  systemctl disable -q httpd
  echo "   Apache del host parado y deshabilitado (su configuración queda intacta)."
else
  echo "   ❌ La comprobación final ha fallado: se restaura Apache."
  $COMPOSE stop frontend </dev/null
  systemctl start httpd
  exit 1
fi
docker image prune -f >/dev/null
REMOTE

echo "🌍 Comprobando desde fuera..."
for url in "https://$DOMAIN/" "https://$DOMAIN/social/" "https://$DOMAIN/inventario"; do
  printf '   %-40s %s\n' "$url" "$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$url")"
done
echo "✅ Desplegado. Panel de enlaces: https://$DOMAIN/social/login"
echo "   Si algo va mal: ./deploy_prod.sh --rollback"
