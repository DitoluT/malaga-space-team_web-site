#!/bin/sh
# Primer arranque: instala LinkStack sin pasar por el asistente web y crea
# la página con los enlaces del equipo. Después delega en el entrypoint oficial.
set -eu

if [ -f /htdocs/INSTALLING ]; then
    echo "[init] Primer arranque: configurando LinkStack..."

    if [ -z "${LINKSTACK_ADMIN_PASSWORD:-}" ]; then
        LINKSTACK_ADMIN_PASSWORD="$(head -c 18 /dev/urandom | base64 | tr -d '/+=' | cut -c1-20)"
        export LINKSTACK_ADMIN_PASSWORD
        echo "[init] LINKSTACK_ADMIN_PASSWORD no definida. Contraseña generada para el admin:"
        echo "[init]     ${LINKSTACK_ADMIN_PASSWORD}"
        echo "[init] Cámbiala desde el panel (/social/login) tras el primer acceso."
    fi

    cd /htdocs
    php artisan key:generate --force
    php /usr/local/share/linkstack/seed.php
    php artisan config:clear >/dev/null 2>&1 || true
fi

exec docker-entrypoint.sh
