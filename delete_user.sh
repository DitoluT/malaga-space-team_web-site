#!/bin/bash

# Script para borrar usuarios del sistema de inventario usando Docker
# No requiere Python instalado en el servidor
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
    echo -e "${RED}❌ Error: Argumentos insuficientes${NC}\n"
    echo "Uso: ./delete_user.sh <username>"
    echo ""
    echo "Ejemplo:"
    echo "  ./delete_user.sh juan"
    exit 1
fi

USERNAME=$1

# Verificar si Docker está corriendo
if ! docker ps > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker no está corriendo o no tienes permisos${NC}"
    echo "Inicia Docker o ejecuta con sudo"
    exit 1
fi

# Verificar si el contenedor del backend existe
if ! docker ps -a | grep -q malaga-inventory-backend; then
    echo -e "${RED}❌ Error: El contenedor del backend no existe${NC}"
    echo "Inicia el backend primero: ./docker-backend.sh"
    exit 1
fi

# Verificar que la base de datos existe
if [ ! -f "data/inventory.db" ]; then
    echo -e "${RED}❌ Error: La base de datos no existe${NC}"
    echo "Inicia el backend primero: ./docker-backend.sh"
    exit 1
fi

echo -e "${BLUE}🔍 Buscando usuario...${NC}"
echo ""

# Obtener información del usuario antes de borrar
USER_INFO=$(docker exec malaga-inventory-backend python -c "
import sqlite3

DATABASE_PATH = '/app/data/inventory.db'

try:
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    user = cursor.execute('''
        SELECT id, username, nombre_completo, email, rol 
        FROM usuarios 
        WHERE username = ?
    ''', ('${USERNAME}',)).fetchone()
    
    conn.close()
    
    if not user:
        print('NOT_FOUND')
    else:
        print(f'{user[0]}|{user[1]}|{user[2]}|{user[3]}|{user[4]}')
        
except Exception as e:
    print(f'ERROR: {e}')
" 2>&1)

# Verificar si el usuario existe
if [ "$USER_INFO" == "NOT_FOUND" ]; then
    echo -e "${RED}❌ Error: El usuario '${USERNAME}' no existe${NC}"
    exit 1
elif [[ "$USER_INFO" == ERROR:* ]]; then
    echo -e "${RED}❌ $USER_INFO${NC}"
    exit 1
fi

# Parsear información del usuario
IFS='|' read -r USER_ID USER_USERNAME USER_NAME USER_EMAIL USER_ROLE <<< "$USER_INFO"

# Mostrar información del usuario
echo -e "${YELLOW}⚠️  Se va a borrar el siguiente usuario:${NC}"
echo ""
echo "   ID: $USER_ID"
echo "   Username: $USER_USERNAME"
echo "   Nombre: $USER_NAME"
echo "   Email: $USER_EMAIL"
echo "   Rol: $USER_ROLE"
echo ""
echo -e "${RED}⚠️  ADVERTENCIA: Esta acción NO se puede deshacer${NC}"
echo ""
echo -e "Para confirmar, escribe: ${GREEN}SI${NC}"
read -p "Confirmación: " CONFIRMACION

if [ "$CONFIRMACION" != "SI" ]; then
    echo ""
    echo -e "${BLUE}ℹ️  Operación cancelada${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}🗑️  Borrando usuario...${NC}"

# Ejecutar script Python dentro del contenedor Docker
RESULT=$(docker exec malaga-inventory-backend python -c "
import sqlite3

DATABASE_PATH = '/app/data/inventory.db'

try:
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM usuarios WHERE username = ?', ('${USERNAME}',))
    conn.commit()
    conn.close()
    
    print('SUCCESS')
except Exception as e:
    print(f'ERROR: {e}')
" 2>&1)

if [ "$RESULT" == "SUCCESS" ]; then
    echo ""
    echo -e "${GREEN}✅ Usuario '$USERNAME' borrado exitosamente${NC}"
else
    echo ""
    echo -e "${RED}❌ $RESULT${NC}"
    exit 1
fi
