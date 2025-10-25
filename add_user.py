#!/usr/bin/env python3
"""
Script para añadir usuarios al sistema de inventario
Uso: python3 add_user.py <username> <password> <role> [nombre_completo] [email]

Roles disponibles:
  - user: Solo puede ver items
  - manager: Puede ver, añadir y modificar items
  - admin: Puede ver, añadir, modificar y borrar items
"""

import sys
import sqlite3
import bcrypt
import os

# Buscar base de datos en varias ubicaciones posibles
DATABASE_PATHS = [
    './data/inventory.db',           # Docker volume
    './inventario.db',                # Local antiguo
    './src/database/inventory.db',   # Local nuevo
]

def find_database():
    """Encontrar la base de datos en las ubicaciones posibles"""
    for path in DATABASE_PATHS:
        if os.path.exists(path):
            return path
    # Si no existe, usar la ubicación de Docker
    return DATABASE_PATHS[0]

DATABASE_PATH = find_database()

def get_db_connection():
    """Conectar a la base de datos"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def crear_usuario(username, password, rol, nombre_completo=None, email=None):
    """Crear un nuevo usuario en la base de datos"""
    
    # Validar rol
    roles_validos = ['user', 'manager', 'admin']
    if rol not in roles_validos:
        print(f"❌ Error: Rol '{rol}' no válido. Roles válidos: {', '.join(roles_validos)}")
        return False
    
    # Si no se proporciona nombre completo, usar el username
    if not nombre_completo:
        nombre_completo = username.capitalize()
    
    # Si no se proporciona email, generar uno por defecto
    if not email:
        email = f"{username}@malagaspaceteam.uma.es"
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verificar si el usuario ya existe
        existing = cursor.execute('SELECT id FROM usuarios WHERE username = ?', (username,)).fetchone()
        if existing:
            print(f"❌ Error: El usuario '{username}' ya existe")
            conn.close()
            return False
        
        # Hash de la contraseña con bcrypt
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Insertar usuario
        cursor.execute('''
            INSERT INTO usuarios (username, password, nombre_completo, email, rol)
            VALUES (?, ?, ?, ?, ?)
        ''', (username, hashed_password, nombre_completo, email, rol))
        
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        
        print(f"✅ Usuario creado exitosamente:")
        print(f"   ID: {user_id}")
        print(f"   Username: {username}")
        print(f"   Nombre: {nombre_completo}")
        print(f"   Email: {email}")
        print(f"   Rol: {rol}")
        print(f"\n🔑 Credenciales de acceso:")
        print(f"   Usuario: {username}")
        print(f"   Contraseña: {password}")
        
        # Mostrar permisos según el rol
        print(f"\n📋 Permisos del rol '{rol}':")
        if rol == 'user':
            print("   ✓ Ver items del inventario")
            print("   ✗ Añadir items")
            print("   ✗ Modificar items")
            print("   ✗ Borrar items")
        elif rol == 'manager':
            print("   ✓ Ver items del inventario")
            print("   ✓ Añadir items")
            print("   ✓ Modificar items")
            print("   ✗ Borrar items")
        elif rol == 'admin':
            print("   ✓ Ver items del inventario")
            print("   ✓ Añadir items")
            print("   ✓ Modificar items")
            print("   ✓ Borrar items")
            print("   ✓ Gestionar usuarios")
        
        return True
        
    except sqlite3.IntegrityError as e:
        print(f"❌ Error de integridad: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Función principal"""
    
    # Verificar argumentos
    if len(sys.argv) < 4:
        print("❌ Error: Argumentos insuficientes\n")
        print("Uso: python3 add_user.py <username> <password> <role> [nombre_completo] [email]\n")
        print("Roles disponibles:")
        print("  • user    - Solo puede ver items")
        print("  • manager - Puede ver, añadir y modificar items")
        print("  • admin   - Puede ver, añadir, modificar y borrar items\n")
        print("Ejemplos:")
        print("  python3 add_user.py juan pass123 user")
        print("  python3 add_user.py maria pass456 manager 'Maria Garcia' maria@uma.es")
        print("  python3 add_user.py admin admin123 admin 'Administrador' admin@uma.es")
        sys.exit(1)
    
    username = sys.argv[1]
    password = sys.argv[2]
    rol = sys.argv[3]
    nombre_completo = sys.argv[4] if len(sys.argv) > 4 else None
    email = sys.argv[5] if len(sys.argv) > 5 else None
    
    # Verificar que la base de datos existe
    if not os.path.exists(DATABASE_PATH):
        print(f"❌ Error: La base de datos '{DATABASE_PATH}' no existe")
        print("   Ejecuta primero el servidor para crear la base de datos: ./backend.sh")
        sys.exit(1)
    
    # Crear usuario
    success = crear_usuario(username, password, rol, nombre_completo, email)
    
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
