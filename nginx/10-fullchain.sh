#!/bin/sh
# nginx necesita certificado + intermedia en un solo fichero; la UMA los entrega
# por separado. Se regenera en cada arranque: al renovar el certificado basta con
# `docker compose restart frontend`.
set -e
mkdir -p /etc/nginx/certs
{ cat /certs/cert.cer; echo; cat /certs/chain.cer; } > /etc/nginx/certs/fullchain.pem
echo "10-fullchain.sh: cadena de certificados generada"
