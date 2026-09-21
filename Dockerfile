# La imagen del frontend une dos builds:
#   1. web/    -> la web pública (Astro + AstroWind), en la raíz del repo
#   2. panel/  -> las apps React de /inventario y /admin (Vite)

# --- Web pública (Astro) ---
FROM node:22-alpine AS web
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY astro.config.ts tsconfig.json ./
COPY vendor ./vendor
COPY public ./public
COPY src ./src
RUN npm run build

# --- Inventario y admin (React + Vite) ---
FROM node:22-alpine AS panel
WORKDIR /app
COPY panel/package*.json ./
# better-sqlite3 se compila si no hay binario precompilado para la plataforma
RUN apk add --no-cache python3 make g++ && \
    npm ci && \
    npm cache clean --force
COPY panel/ ./
RUN npm run build

# --- Producción ---
FROM nginx:alpine

COPY --from=web /app/dist /usr/share/nginx/html
# inventario.html, admin.html y sus assets (/assets/*); la web usa /_astro/*, no chocan
COPY --from=panel /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx/locations.conf /etc/nginx/snippets/locations.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
