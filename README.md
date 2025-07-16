# Málaga Space Team - Website

Sitio web oficial del Málaga Space Team, un proyecto CubeSat 2U desarrollado por la Universidad de Málaga.

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
