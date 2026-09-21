# LinkStack (https://github.com/LinkStackOrg/LinkStack) servido en /social
FROM linkstackorg/linkstack:latest

# Apache: servir la app bajo el subdirectorio /social
COPY social.conf /etc/apache2/conf.d/zz-social.conf

# Instalación desatendida + enlaces iniciales (solo en el primer arranque)
COPY seed.php avatar.png /usr/local/share/linkstack/
COPY --chmod=0755 init.sh /usr/local/bin/linkstack-init.sh

HEALTHCHECK CMD curl -f http://localhost/social/ -A "HealthCheck" || exit 1

CMD ["linkstack-init.sh"]
