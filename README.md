# Málaga Space Team - Website

Sitio web oficial del Málaga Space Team, un proyecto CubeSat 2U desarrollado por la Universidad de Málaga.

---

## Gestionar la web desde `/admin`

Todo el contenido vivo de la web se gestiona en `https://spaceteam.uma.es/admin`, sin tocar
código ni recompilar: al guardar, el cambio ya está en la web.

| Pestaña                             | Qué gestiona                                                                                  | Dónde sale                                                                                                                                                                      |
| ----------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Equipo**                          | Personas del equipo: nombre, equipo, rol, LinkedIn/GitHub                                     | Sección «Equipo» de la portada, agrupadas por equipo. Quien esté marcado como «Antiguo miembro» sale solo en [`/antiguos-miembros`](https://spaceteam.uma.es/antiguos-miembros) |
| **Colaboradores**                   | Instituciones y grupos que apoyan el proyecto, con descripción (y versión en inglés opcional) | Sección «Nuestros Colaboradores»                                                                                                                                                |
| **Patrocinadores**                  | Empresas patrocinadoras: nombre, web y logo                                                   | Sección «Patrocinadores» (oculta si no hay ninguno)                                                                                                                             |
| **Usuarios** (solo administradores) | Cuentas del panel y del inventario                                                            | —                                                                                                                                                                               |
| **Mi perfil**                       | Tu contraseña y el LinkedIn de tu ficha                                                       | —                                                                                                                                                                               |

En las tres listas de contenido se puede **añadir**, **editar**, **ocultar/mostrar** (sin
borrar), **ordenar** con las flechas (el orden de la lista es el orden en la web) y
**eliminar**. En **Equipo**, el equipo y el rol se cambian directamente en la fila y se guardan
al momento; el filtro de arriba ayuda a localizar a quien sigue «Sin asignar». Los logos se
suben desde el propio formulario (PNG, JPG, WebP, GIF o SVG, hasta 10 MB). La web no muestra
fotos de los miembros.

**Permisos**

- **Lector** (`viewer`): no edita nada, salvo el **enlace de LinkedIn de su propia ficha**
  (pestaña «Mi perfil»), si un administrador ha vinculado su cuenta a esa ficha («Cuenta
  vinculada» en el formulario del miembro).
- **Gestor** (`manager`): equipo, colaboradores, patrocinadores e inventario.
- **Administrador** (`admin`): además, usuarios.

Al crear un usuario o restablecerle la contraseña, el panel genera una **contraseña temporal
aleatoria** que se muestra una sola vez; la persona debe cambiarla en su primer acceso.

## Descripción

Web del Málaga Space Team (proyecto CubeSat 2U de la Universidad de Málaga):

- **Web pública** (`/`, `/en`, `/unete`, `/antiguos-miembros`): [Astro](https://astro.build)
  sobre la plantilla [AstroWind](https://github.com/arthelokyo/astrowind), estática, en español
  e inglés, con un diseño minimalista en blanco y negro.
- **Panel de gestión** (`/admin`): página Astro que reutiliza los componentes de la web
  ([`src/pages/admin.astro`](./src/pages/admin.astro), lógica en [`src/scripts/admin.ts`](./src/scripts/admin.ts)).
- **Inventario** (`/inventario`): app React (Vite) en [`panel/`](./panel).
- **Backend** (`/api`): Flask + SQLite en [`src/server/`](./src/server).
- **Página de enlaces** (`/social`): LinkStack, en [`linkstack/`](./linkstack).

## Estructura del proyecto

```
astro.config.ts        Configuración de Astro (i18n es/en, sitemap, fuentes)
src/
├── pages/             Rutas: index, unete, antiguos-miembros, admin, 404 y versiones en /en
├── components/mst/    Secciones propias: portada, subsistemas, equipo, colaboradores, contacto
├── components/admin/  Piezas del panel /admin (lista gestionable y campos de formulario)
├── components/        Cabecera, pie y utilidades heredadas de AstroWind
├── i18n/              Textos en es.json / en.json + rutas por idioma (index.ts)
├── scripts/           Carga en vivo desde la API (live.ts), panel (admin.ts) y EmailJS (emailForm.ts)
├── assets/            Logos, favicons y estilos (CustomStyles.astro define la paleta)
├── config.yaml        Nombre del sitio, SEO por defecto, tema
└── server/            Backend Flask (inventario, usuarios, contenido web)
panel/                 App React de /inventario (proyecto Vite independiente)
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

La app de inventario se desarrolla aparte:

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

En `spaceteam.uma.es/social` se sirve una página de enlaces tipo _link in bio_ con
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
./deploy_prod.sh --rollback  # vuelve a la versión anterior del frontend
```

El script envía la rama al servidor, completa su `.env`, hace copia de `data/inventory.db`,
construye las imágenes (la web sigue en marcha mientras tanto), actualiza los contenedores y
comprueba la web en local y desde fuera. Si alguna comprobación falla, vuelve sola a la imagen
anterior. El Apache que servía la web antes de Docker sigue instalado pero parado y deshabilitado.

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
