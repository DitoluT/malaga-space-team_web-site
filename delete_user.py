#!/usr/bin/env python3
"""
Script para borrar usuarios del sistema de inventario
Uso: python3 delete_user.py <username>
"""

import sys
import sqlite3
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

def borrar_usuario(username):
    """Borrar un usuario de la base de datos"""
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verificar si el usuario existe
        user = cursor.execute('SELECT id, username, nombre_completo, rol FROM usuarios WHERE username = ?', (username,)).fetchone()
        
        if not user:
            print(f"❌ Error: El usuario '{username}' no existe")
            conn.close()
            return False
        
        # Mostrar información del usuario antes de borrar
        print(f"⚠️  Vas a borrar el siguiente usuario:")
        print(f"   ID: {user['id']}")
        print(f"   Username: {user['username']}")
        print(f"   Nombre: {user['nombre_completo']}")
        print(f"   Rol: {user['rol']}")
        print()
        
        # Confirmación
        respuesta = input("¿Estás seguro? (escribe 'SI' para confirmar): ")
        if respuesta != 'SI':
            print("❌ Operación cancelada")
            conn.close()
            return False
        
        # Borrar el usuario
        cursor.execute('DELETE FROM usuarios WHERE username = ?', (username,))
        conn.commit()
        conn.close()
        
        print(f"\n✅ Usuario '{username}' borrado exitosamente")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Función principal"""
    
    # Verificar argumentos
    if len(sys.argv) < 2:
        print("❌ Error: Debes proporcionar el username\n")
        print("Uso: python3 delete_user.py <username>\n")
        print("Ejemplo:")
        print("  python3 delete_user.py juan")
        sys.exit(1)
    
    username = sys.argv[1]
    
    # Verificar que la base de datos existe
    if not os.path.exists(DATABASE_PATH):
        print(f"❌ Error: La base de datos '{DATABASE_PATH}' no existe")
        print("   Ejecuta primero el servidor para crear la base de datos: ./backend.sh")
        sys.exit(1)
    
    # Borrar usuario
    success = borrar_usuario(username)
    
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
