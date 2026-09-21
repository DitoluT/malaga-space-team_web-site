#!/bin/bash

# Redespliegue en el servidor de producción. Lo lanza el servicio /reload
# (https://spaceteam.uma.es/reload -> /root/server/server.py -> /root/load_website.sh).
#
# Antes ese flujo clonaba el repo y copiaba dist/ a /var/www/html; dist/ ya no se
# versiona y la web corre en Docker, así que ahora: git pull + reconstruir contenedores.
# Si el pull falla no se toca nada de lo que está en marcha.

set -euo pipefail
cd "$(dirname "$(readlink -f "$0")")"

exec 9>/tmp/malaga-reload.lock
flock -n 9 || { echo "Ya hay un despliegue en curso."; exit 0; }

git pull --ff-only || { echo "Error en git pull: no se cambia nada."; exit 1; }

docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d --remove-orphans
docker image prune -f >/dev/null

echo "Despliegue completado correctamente."
