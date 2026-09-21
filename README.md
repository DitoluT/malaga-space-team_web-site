# Málaga Space Team - Website

Sitio web oficial del Málaga Space Team, un proyecto CubeSat 2U desarrollado por la Universidad de Málaga.

---

## Añadir miembros al equipo y asignarles un rol

No hace falta tocar código ni recompilar: los miembros se gestionan desde el panel y aparecen
en la web al momento.

1. Entra en `https://spaceteam.uma.es/admin` e inicia sesión (rol `admin` o `manager`).
2. Ve a **Equipo** → **Añadir**.
3. Rellena la ficha:
   - **Nombre** y **Rol / Cargo** (texto libre; el campo sugiere los roles habituales:
     «Líder de Subsistema», «Ingeniero de Software»...).
   - **Título académico** (opcional): «3º Grado», «PhD»...
   - **Departamento**: decide en qué bloque de la web aparece (Profesorado, Dirección y
     Coordinación, Estructura y Energía, Comunicaciones, Estación Terrena, Sistemas de Control
     y Software, Marketing).
   - **Nivel jerárquico**: Director/Profesor y Líder salen primero dentro de su departamento.
     **«Antiguo miembro»** saca a la persona de la portada y la muestra solo en la página
     [`/antiguos-miembros`](https://spaceteam.uma.es/antiguos-miembros).
   - **LinkedIn URL** y **GitHub URL** (opcionales): se muestran como enlaces en su tarjeta.
   - **Usuario vinculado** (opcional): permite a esa persona editar su propia ficha.
4. **Guardar**. Para cambiar el rol de alguien, edita su ficha y guarda.

La web no muestra fotos de los miembros. Colaboradores y partners se gestionan igual, desde
**Contenido** en el mismo panel; si no hay ninguno, la web muestra los colaboradores por defecto
(UMA, MobileNet, LINK) y oculta la sección de partners.

## Descripción

Web del Málaga Space Team (proyecto CubeSat 2U de la Universidad de Málaga):

- **Web pública** (`/`, `/en`, `/unete`, `/antiguos-miembros`): [Astro](https://astro.build)
  sobre la plantilla [AstroWind](https://github.com/arthelokyo/astrowind), estática, en español
  e inglés, con un diseño minimalista en blanco y negro.
- **Inventario y administración** (`/inventario`, `/admin`): apps React (Vite) en
  [`panel/`](./panel).
- **Backend** (`/api`): Flask + SQLite en [`src/server/`](./src/server).
- **Página de enlaces** (`/social`): LinkStack, en [`linkstack/`](./linkstack).

## Estructura del proyecto

```
astro.config.ts        Configuración de Astro (i18n es/en, sitemap, fuentes)
src/
├── pages/             Rutas: index, unete, antiguos-miembros, 404 y sus versiones en /en
├── components/mst/    Secciones propias: portada, subsistemas, equipo, colaboradores, contacto
├── components/        Cabecera, pie y utilidades heredadas de AstroWind
├── i18n/              Textos en es.json / en.json + rutas por idioma (index.ts)
├── scripts/           Carga en vivo desde la API (live.ts) y formularios EmailJS (emailForm.ts)
├── assets/            Logos, favicons y estilos (CustomStyles.astro define la paleta)
├── config.yaml        Nombre del sitio, SEO por defecto, tema
└── server/            Backend Flask (inventario, usuarios, contenido web)
panel/                 Apps React de /inventario y /admin (proyecto Vite independiente)
linkstack/             Imagen de LinkStack para /social
nginx/, nginx*.conf    Configuración de nginx (desarrollo y producción)
vendor/                Integración de AstroWind (licencia MIT en vendor/ASTROWIND-LICENSE.md)
```

## Desarrollo

Requiere Node 22 o superior.

```bash
npm install
npm run dev            # web pública en http://localhost:4321
npm run build          # genera dist/
npm run check          # tipos, eslint y prettier
```

La web lee el equipo y los colaboradores de `/api/web/*`; en desarrollo, `npm run dev` reenvía
`/api` a `http://localhost:3001`. Para tener el backend en local:

```bash
docker compose up -d --build inventory-backend
```

Las apps de inventario y admin se desarrollan aparte:

```bash
cd panel && npm install && npm run dev
```

Para probar todo junto como en producción (nginx + backend + LinkStack):

```bash
docker compose up --build
```

### Editar textos y diseño

- **Textos:** [`src/i18n/es.json`](./src/i18n/es.json) y [`src/i18n/en.json`](./src/i18n/en.json).
- **Colores y tipografía:** [`src/components/CustomStyles.astro`](./src/components/CustomStyles.astro)
  (paleta monocroma) y [`src/components/mst/styles.ts`](./src/components/mst/styles.ts).
- **Secciones de la portada:** [`src/components/mst/HomePage.astro`](./src/components/mst/HomePage.astro).
- **Formularios:** usan EmailJS ([`src/config/emailjs.ts`](./src/config/emailjs.ts)).

## Página de enlaces (`/social`)

En `spaceteam.uma.es/social` se sirve una página de enlaces tipo *link in bio* con
[LinkStack](https://github.com/LinkStackOrg/LinkStack). Corre como un servicio más del
`docker-compose.yml` (`linkstack`, definido en [`linkstack/`](./linkstack)) y el nginx del
frontend lo publica bajo `/social`.

- **Primer arranque:** se instala solo (sin asistente web) y crea el perfil
  `@malagaspaceteam` con LinkedIn, Instagram y el correo `spaceteam@uma.es`
  (ver [`linkstack/seed.php`](./linkstack/seed.php)).
- **Contraseña del admin:** define `LINKSTACK_ADMIN_PASSWORD` (p. ej. en un `.env` junto al
  `docker-compose.yml`) antes del primer `./deploy.sh`. Si no se define, se genera una y
  aparece en `docker logs malaga-linkstack`.
- **Editar enlaces, tema, avatar...:** entra en `https://spaceteam.uma.es/social/login` con
  `spaceteam@uma.es` (o `LINKSTACK_ADMIN_EMAIL`). Los cambios se guardan en el volumen
  `linkstack_data`; `seed.php` no vuelve a ejecutarse.
- **Contraseña:** `LINKSTACK_ADMIN_PASSWORD` va en `.env` (no se sube a git; ver
  [`.env.example`](./.env.example)).
- **HTTPS:** LinkStack genera URLs `https://` cuando el proxy de delante envía
  `X-Forwarded-Proto: https`. Si no lo envía, arranca por primera vez con
  `LINKSTACK_FORCE_HTTPS=true`.

## Despliegue en producción (todo en Docker)

En `spaceteam.uma.es` corre todo con Docker Compose: nginx (frontend), el backend de
inventario y LinkStack. Delante está el **proxy inverso de la UMA**, que termina el TLS público
y reenvía `https://` al puerto **443** del servidor (re-cifrado, sin validar el certificado) y
`http://` al **80**; además vigila ambos puertos cada 2 s y devuelve 503 si alguno no responde.
Por eso nginx sirve lo mismo en 80 y 443, con el certificado que usaba Apache montado en solo
lectura. Se usa `docker-compose.yml` + [`docker-compose.prod.yml`](./docker-compose.prod.yml) y
[`nginx.prod.conf`](./nginx.prod.conf).

```bash
./deploy_prod.sh             # despliega la rama actual (commiteada)
./deploy_prod.sh --rollback  # vuelve al Apache del host
```

El script envía la rama al servidor, completa su `.env` (genera `JWT_SECRET`), hace copia de
`data/inventory.db`, ensaya el stack en los puertos 8080/8443 y solo entonces para el Apache del
host y publica nginx en 80 y 443. Si la comprobación final falla, restaura Apache solo.

- **`/reload`:** nginx lo sigue enviando al servicio del host en el puerto 4000, que ahora
  ejecuta [`reload_website.sh`](./reload_website.sh): `git pull` + reconstruir los contenedores.
  (El flujo antiguo copiaba `dist/` a `/var/www/html`; `dist/` ya no se versiona.)
- **Certificado del servidor:** las rutas están en el `.env` del servidor (`TLS_*`). Al
  renovarlo (se pide al CAU), sustituye los ficheros y ejecuta
  `docker compose -f docker-compose.yml -f docker-compose.prod.yml restart frontend`.

## Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

- **Email**: spaceteam@uma.es
- **Teléfono**: +34 952 13 71 00
- **Ubicación**: Universidad de Málaga, 29071 Málaga, España

---

**Málaga Space Team** - Desarrollando tecnología CubeSat de vanguardia para avanzar en la investigación espacial, educación e innovación tecnológica desde la Universidad de Málaga.
