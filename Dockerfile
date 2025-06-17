# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Instala dependencias
COPY package*.json .
RUN npm ci

# Construye el proyecto
COPY . .
RUN npm run build

# Etapa final
FROM nginx:alpine

# Elimina el contenido por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*    

# Copia el resultado de la construcción de Astro hacia Nginx
COPY --from=builder /app/dist/ /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

CMD ["nginx","-g","daemon off;"]

