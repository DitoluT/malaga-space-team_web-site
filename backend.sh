#!/bin/bash

# ====================================
# 🐍 SCRIPT DE DESPLIEGUE DEL BACKEND
# ====================================
# 
# Script para instalar y ejecutar el backend Flask
# del sistema de inventario

echo "╔═══════════════════════════════════════════════════╗"
echo "║                                                   ║"
echo "║     🐍 BACKEND FLASK - SISTEMA INVENTARIO        ║"
echo "║                                                   ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Función para limpiar al salir
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Deteniendo servidor backend...${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Verificar Python
echo -e "${BLUE}🔍 Verificando Python 3...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 no encontrado${NC}"
    echo -e "${YELLOW}   Instala Python 3: https://www.python.org/downloads/${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python $(python3 --version)${NC}"

# Verificar si existe venv
if [ ! -d "venv" ]; then
    echo ""
    echo -e "${YELLOW}📦 Entorno virtual no encontrado. Creando...${NC}"
    python3 -m venv venv
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error al crear entorno virtual${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Entorno virtual creado${NC}"
fi

# Activar entorno virtual
echo ""
echo -e "${BLUE}🔄 Activando entorno virtual...${NC}"
source venv/bin/activate

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al activar entorno virtual${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Entorno virtual activado${NC}"

# Verificar e instalar dependencias
echo ""
echo -e "${BLUE}📦 Verificando dependencias...${NC}"

# Verificar si requirements.txt existe
if [ ! -f "requirements.txt" ]; then
    echo -e "${RED}❌ Archivo requirements.txt no encontrado${NC}"
    exit 1
fi

# Instalar/actualizar dependencias
echo -e "${YELLOW}   Instalando/actualizando dependencias...${NC}"
pip install -q --upgrade pip
pip install -q -r requirements.txt

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al instalar dependencias${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencias instaladas correctamente${NC}"

# Verificar que el servidor existe
if [ ! -f "src/server/inventory_server.py" ]; then
    echo -e "${RED}❌ Archivo del servidor no encontrado: src/server/inventory_server.py${NC}"
    exit 1
fi

# Verificar directorio de base de datos
echo ""
echo -e "${BLUE}🗄️  Verificando base de datos...${NC}"
mkdir -p src/database

if [ -f "src/database/inventory.db" ]; then
    echo -e "${GREEN}✅ Base de datos existente encontrada${NC}"
else
    echo -e "${YELLOW}⚠️  Base de datos no existe (se creará automáticamente)${NC}"
fi

# Mostrar información
echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║                                                   ║"
echo "║     🚀 INICIANDO SERVIDOR BACKEND                ║"
echo "║                                                   ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

echo -e "${BLUE}📋 Información del servidor:${NC}"
echo ""
echo -e "   Puerto:         ${GREEN}3001${NC}"
echo -e "   Base de datos:  ${GREEN}src/database/inventory.db${NC}"
echo -e "   Entorno:        ${GREEN}$(python3 --version)${NC}"
echo -e "   Framework:      ${GREEN}Flask${NC}"
echo ""

echo -e "${BLUE}🌐 URLs de la API:${NC}"
echo ""
echo -e "   API Base:       ${GREEN}http://localhost:3001/api/inventory${NC}"
echo -e "   Login:          ${GREEN}http://localhost:3001/api/inventory/login${NC}"
echo -e "   Items:          ${GREEN}http://localhost:3001/api/inventory/items${NC}"
echo -e "   Stats:          ${GREEN}http://localhost:3001/api/inventory/stats${NC}"
echo ""

echo -e "${BLUE}👤 Credenciales por defecto:${NC}"
echo ""
echo -e "   Usuario:        ${YELLOW}admin${NC}"
echo -e "   Contraseña:     ${YELLOW}admin123${NC}"
echo -e "   Rol:            ${YELLOW}admin${NC}"
echo ""

echo -e "${RED}⚠️  Para detener el servidor: Presiona Ctrl+C${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Iniciar servidor
python3 src/server/inventory_server.py

# Si el servidor se detiene
echo ""
echo -e "${YELLOW}👋 Servidor detenido${NC}"
