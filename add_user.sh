#!/bin/bash

# Script para añadir usuarios al sistema de inventario usando Docker
# No requiere Python instalado en el servidor
# Uso: ./add_user.sh <username> <role> [nombre_completo] [email]
#      La contraseña por defecto será "cambiarme123" y se requerirá cambio al primer login

set -e

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar argumentos
if [ $# -lt 2 ]; then
    echo -e "${RED}❌ Error: Argumentos insuficientes${NC}\n"
    echo "Uso: ./add_user.sh <username> <role> [nombre_completo] [email]"
    echo ""
    echo "⚠️  La contraseña por defecto será: ${YELLOW}cambiarme123${NC}"
    echo "    El usuario deberá cambiarla en su primer login"
    echo ""
    echo "Roles disponibles:"
    echo "  • user    - Solo puede ver items"
    echo "  • manager - Puede ver, añadir y modificar items"
    echo "  • admin   - Puede ver, añadir, modificar y borrar items"
    echo ""
    echo "Ejemplos:"
    echo "  ./add_user.sh juan user"
    echo "  ./add_user.sh maria manager 'Maria Garcia' maria@uma.es"
    echo "  ./add_user.sh admin admin 'Administrador' admin@uma.es"
    exit 1
fi

USERNAME=$1
ROLE=$2
NOMBRE_COMPLETO=${3:-$USERNAME}
EMAIL=${4:-"${USERNAME}@uma.es"}
PASSWORD="mst"  # Contraseña por defecto

# Validar rol
if [[ ! "$ROLE" =~ ^(user|manager|admin)$ ]]; then
    echo -e "${RED}❌ Error: Rol '$ROLE' no válido${NC}"
    echo "Roles válidos: user, manager, admin"
    exit 1
fi

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
    echo -e "${YELLOW}⚠️  La base de datos no existe, se creará al iniciar el backend${NC}"
    echo "Inicia el backend primero: ./docker-backend.sh"
    exit 1
fi

echo -e "${BLUE}👤 Creando usuario...${NC}"
echo ""

# Ejecutar script Python dentro del contenedor Docker
docker exec malaga-inventory-backend python -c "
import sqlite3
import bcrypt
import sys

DATABASE_PATH = '/app/data/inventory.db'

def crear_usuario(username, password, rol, nombre_completo, email):
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Verificar si el usuario ya existe
        existing = cursor.execute('SELECT id FROM usuarios WHERE username = ?', (username,)).fetchone()
        if existing:
            print(f'❌ Error: El usuario \\'{username}\\' ya existe')
            return False
        
        # Hash de la contraseña con bcrypt
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Insertar usuario con flag de cambio obligatorio
        cursor.execute('''
            INSERT INTO usuarios (username, password, nombre_completo, email, rol, requiere_cambio_password)
            VALUES (?, ?, ?, ?, ?, 1)
        ''', (username, hashed_password, nombre_completo, email, rol))
        
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        
        print(f'✅ Usuario creado exitosamente:')
        print(f'   ID: {user_id}')
        print(f'   Username: {username}')
        print(f'   Nombre: {nombre_completo}')
        print(f'   Email: {email}')
        print(f'   Rol: {rol}')
        print(f'')
        print(f'🔑 Credenciales de acceso (compartir con el usuario):')
        print(f'   Usuario: {username}')
        print(f'   Contraseña temporal: {password}')
        print(f'')
        print(f'⚠️  El usuario DEBE cambiar su contraseña en el primer login')
        print(f'')
        print(f'📋 Permisos del rol \\'{rol}\\'')
        
        if rol == 'user':
            print('   ✓ Ver items del inventario')
            print('   ✗ Añadir items')
            print('   ✗ Modificar items')
            print('   ✗ Borrar items')
        elif rol == 'manager':
            print('   ✓ Ver items del inventario')
            print('   ✓ Añadir items')
            print('   ✓ Modificar items')
            print('   ✗ Borrar items')
        elif rol == 'admin':
            print('   ✓ Ver items del inventario')
            print('   ✓ Añadir items')
            print('   ✓ Modificar items')
            print('   ✓ Borrar items')
            print('   ✓ Gestionar usuarios')
        
        return True
        
    except Exception as e:
        print(f'❌ Error: {e}')
        return False

# Ejecutar
success = crear_usuario('${USERNAME}', '${PASSWORD}', '${ROLE}', '${NOMBRE_COMPLETO}', '${EMAIL}')
sys.exit(0 if success else 1)
"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ ¡Usuario creado correctamente!${NC}"
else
    echo ""
    echo -e "${RED}❌ Error al crear el usuario${NC}"
    exit 1
fi
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
