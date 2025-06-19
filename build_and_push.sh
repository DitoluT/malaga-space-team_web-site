#!/bin/bash

# Verificar que estamos en un repo git y hay package.json
if [ ! -d ".git" ]; then
  echo "Error: No es un repositorio git."
  exit 1
fi

if [ ! -f "package.json" ]; then
  echo "Error: No se encontró package.json."
  exit 1
fi

# Ejecutar build
npm run build || {
  echo "Error durante npm run build"
  exit 1
}

# Añadir cambios al staging
git add . || {
  echo "Error en git add"
  exit 1
}

# Commit con mensaje con fecha/hora
COMMIT_MSG="Build and deploy $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MSG" || { echo "No hay cambios para commitear"; }

# Hacer push
git push origin || {
  echo "Error en git push"
  exit 1
}

echo "Proceso completado."
