import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig, fontProviders } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import compress from 'astro-compress';

import astrowind from './vendor/integration';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  output: 'static',

  // Español en "/" e inglés en "/en/" (ver src/i18n)
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: false },
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
  ],

  integrations: [
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-ES', en: 'en-US' } },
    }),
    icon({
      iconDir: 'src/assets/icons',
      include: { tabler: ['*'] },
    }),

    compress({
      // csso off: no entiende la sintaxis de media queries de Tailwind v4 (ver AstroWind)
      CSS: { csso: false, lightningcss: { minify: true } },
      HTML: { 'html-minifier-terser': { removeAttributeQuotes: false } },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    responsiveStyles: true,
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // En desarrollo, la API del backend (src/server) corre en :3001
      proxy: { '/api': 'http://localhost:3001' },
    },
  },
});
