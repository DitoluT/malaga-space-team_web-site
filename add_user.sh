#!/bin/bash

# Script para añadir usuarios al sistema de inventario
# Uso: ./add_user.sh <username> <password> <role> [nombre_completo] [email]

set -e

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar argumentos
if [ $# -lt 3 ]; then
    echo -e "${RED}❌ Error: Argumentos insuficientes${NC}\n"
    echo "Uso: ./add_user.sh <username> <password> <role> [nombre_completo] [email]"
    echo ""
    echo "Roles disponibles:"
    echo "  • user    - Solo puede ver items"
    echo "  • manager - Puede ver, añadir y modificar items"
    echo "  • admin   - Puede ver, añadir, modificar y borrar items"
    echo ""
    echo "Ejemplos:"
    echo "  ./add_user.sh juan pass123 user"
    echo "  ./add_user.sh maria pass456 manager 'Maria Garcia' maria@uma.es"
    echo "  ./add_user.sh admin admin123 admin 'Administrador' admin@uma.es"
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
python3 add_user.py "$@"

exit $?
