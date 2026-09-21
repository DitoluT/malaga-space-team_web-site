# Málaga Space Team - Website

Sitio web oficial del Málaga Space Team, un proyecto CubeSat 2U desarrollado por la Universidad de Málaga.

---

## 📝 ¿Quieres editar el contenido de la web?

### Para Editores de Contenido (No técnicos):

1. **📖 Lee la guía completa:** [`GUIA-EDICION-CONTENIDO.md`](./GUIA-EDICION-CONTENIDO.md)
2. **🚀 Guía rápida:** [`GUIA-RAPIDA.md`](./GUIA-RAPIDA.md)
3. **👥 Añadir participantes:** [`PLANTILLA-PARTICIPANTES.md`](./PLANTILLA-PARTICIPANTES.md)
4. **📋 Índice de contenidos:** [`src/content/index.ts`](./src/content/index.ts)

### Para Desarrolladores:

Continúa leyendo esta documentación técnica.

---

## Descripción

Este sitio web presenta el proyecto CubeSat del Málaga Space Team, desarrollado con React/TypeScript y Vite. El sitio incluye información sobre:

- Misión y objetivos del proyecto
- Cronograma de desarrollo
- Subsistemas del CubeSat
- Información del equipo
- Contacto y colaboración

## Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Email**: EmailJS

## Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## Optimizaciones SEO Implementadas

### Meta Tags y HTML Structure
- ✅ Tags meta completos incluyendo title, description, keywords
- ✅ Open Graph tags para redes sociales
- ✅ Twitter Cards para compartir en Twitter
- ✅ Meta tags adicionales para PWA y dispositivos móviles
- ✅ Canonical URL configurada
- ✅ Idioma configurado en español (es)

### Estructura HTML Semántica
- ✅ Etiqueta H1 principal en sección hero
- ✅ Jerarquía correcta de headers (h1, h2, h3, h4)
- ✅ Navegación semántica con elementos `<nav>`
- ✅ Etiquetas `<main>`, `<section>`, `<footer>` apropiadas
- ✅ Roles ARIA para mejor accesibilidad

### Imágenes y Media
- ✅ Atributos alt en todas las imágenes
- ✅ Imágenes optimizadas para web
- ✅ Favicon y touch icons configurados
- ✅ Dimensiones especificadas para evitar layout shifts

### Datos Estructurados (Schema.org)
- ✅ Structured data JSON-LD para Organization
- ✅ Structured data JSON-LD para WebSite
- ✅ Información de contacto estructurada
- ✅ Breadcrumbs semánticos en navegación

### Archivos Técnicos SEO
- ✅ `robots.txt` configurado correctamente
- ✅ `sitemap.xml` con todas las secciones
- ✅ URLs amigables con anchors semánticos

### Accesibilidad
- ✅ Etiquetas ARIA apropiadas
- ✅ Contraste de colores adecuado
- ✅ Navegación por teclado
- ✅ Formularios con labels asociados
- ✅ Estados de focus visibles

### Performance
- ✅ Recursos optimizados con Vite
- ✅ DNS prefetch para recursos externos
- ✅ Preload de recursos críticos
- ✅ Lazy loading donde es apropiado
- ✅ Compresión gzip habilitada

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes UI base
│   ├── HeroSection.tsx # Sección principal
│   ├── Navigation.tsx  # Navegación principal
│   ├── MissionSection.tsx
│   ├── TeamSection.tsx
│   └── ...
├── content/            # Contenido estático
├── hooks/              # Custom hooks
├── utils/              # Utilidades
└── styles/             # Estilos globales

public/
├── robots.txt          # Directivas para crawlers
├── sitemap.xml         # Mapa del sitio
├── Logo negativo.png   # Logo principal
└── ...
```

## Configuración de Despliegue

El sitio está optimizado para despliegue en:
- GitHub Pages
- Netlify
- Vercel
- Servidores web estáticos

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
inventario y LinkStack. **El TLS lo termina el proxy inverso de la UMA**, que reenvía todo por
HTTP al puerto 80 del servidor; por eso en el servidor no hay certificados ni redirección a
https. Se usa `docker-compose.yml` + [`docker-compose.prod.yml`](./docker-compose.prod.yml) y
[`nginx.prod.conf`](./nginx.prod.conf).

```bash
./deploy_prod.sh             # despliega la rama actual (commiteada)
./deploy_prod.sh --rollback  # vuelve al Apache del host
```

El script envía la rama al servidor, completa su `.env` (genera `JWT_SECRET`), hace copia de
`data/inventory.db`, ensaya el stack en `127.0.0.1:8080` y solo entonces para el Apache del
host y publica nginx en el puerto 80. Si la comprobación final falla, restaura Apache solo.

- **`/reload`:** nginx lo sigue enviando al servicio del host en el puerto 4000, que ahora
  ejecuta [`reload_website.sh`](./reload_website.sh): `git pull` + reconstruir los contenedores.
  (El flujo antiguo copiaba `dist/` a `/var/www/html`; `dist/` ya no se versiona.)
- **TLS:** lo termina el proxy de la UMA; el servidor solo recibe HTTP en el puerto 80.

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
