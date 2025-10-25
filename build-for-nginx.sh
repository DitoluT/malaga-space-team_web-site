#!/bin/bash

# Script de despliegue para Málaga Space Team
# Construye el proyecto y lo prepara para Nginx

set -e

echo "🚀 Iniciando proceso de build..."

# Limpiar dist anterior
if [ -d "dist" ]; then
    echo "🧹 Limpiando carpeta dist anterior..."
    rm -rf dist
fi

# Build del proyecto
echo "📦 Construyendo proyecto con Vite..."
npm run build

# Verificar que los archivos HTML se generaron
if [ ! -f "dist/index.html" ]; then
    echo "❌ Error: index.html no se generó"
    exit 1
fi

if [ ! -f "dist/inventario.html" ]; then
    echo "❌ Error: inventario.html no se generó"
    exit 1
fi

echo "✅ Build completado exitosamente"
echo ""
echo "📋 Archivos generados:"
ls -lh dist/*.html

echo ""
echo "📝 Instrucciones para desplegar en Nginx:"
echo "1. Copia la carpeta dist a tu servidor:"
echo "   scp -r dist/* usuario@servidor:/var/www/malaga-space-team/"
echo ""
echo "2. Usa la configuración de nginx.conf incluida en el proyecto"
echo ""
echo "3. Reinicia Nginx:"
echo "   sudo systemctl restart nginx"
echo ""
echo "🌐 Rutas disponibles:"
echo "   • http://tu-dominio.com/          → Página principal"
echo "   • http://tu-dominio.com/inventario → Sistema de inventario"
