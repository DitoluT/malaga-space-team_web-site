#!/bin/bash

# Script para borrar usuarios del sistema de inventario
# Uso: ./delete_user.sh <username>

set -e

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar argumentos
if [ $# -lt 1 ]; then
    echo -e "${RED}❌ Error: Debes proporcionar el username${NC}\n"
    echo "Uso: ./delete_user.sh <username>"
    echo ""
    echo "Ejemplo:"
    echo "  ./delete_user.sh juan"
    exit 1
fi

# Activar entorno virtual si existe
if [ -d "venv" ]; then
    echo -e "${BLUE}🔄 Activando entorno virtual...${NC}"
    source venv/bin/activate
else
    echo -e "${RED}❌ Error: No se encontró el entorno virtual${NC}"
    echo "   Ejecuta primero: ./backend.sh"
    exit 1
fi

# Ejecutar script de Python
python3 delete_user.py "$@"

exit $?
