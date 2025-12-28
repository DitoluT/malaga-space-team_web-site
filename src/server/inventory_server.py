#!/usr/bin/env python3
"""
====================================
🗄️ SERVIDOR DE INVENTARIO - FLASK
====================================

Servidor Flask para gestionar el inventario del equipo
con autenticación JWT y roles de usuario.

ROLES:
- viewer: Solo puede ver el inventario
- manager: Puede ver, añadir y modificar
- admin: Puede ver, añadir, modificar y eliminar
"""

from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import bcrypt
import sqlite3
import jwt
import datetime
import os
from functools import wraps

app = Flask(__name__)

# Configuración
app.config['SECRET_KEY'] = os.environ.get('JWT_SECRET', 'malaga-space-team-secret-key-change-in-production')
DATABASE_PATH = os.environ.get('DATABASE_PATH', os.path.join(os.path.dirname(__file__), '../database/inventory.db'))

# CORS configuración
CORS(app, 
     origins=['http://localhost:5173', 'http://localhost', os.environ.get('FRONTEND_URL', '*')],
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

# ====================================
# FUNCIONES DE BASE DE DATOS
# ====================================

def get_db_connection():
    """Crear conexión a la base de datos"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Inicializar base de datos y crear tablas"""
    os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Tabla de usuarios
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            nombre_completo TEXT NOT NULL,
            email TEXT,
            rol TEXT NOT NULL DEFAULT 'viewer',
            activo INTEGER DEFAULT 1,
            requiere_cambio_password INTEGER DEFAULT 0,
            fecha_creacion TEXT DEFAULT (DATETIME('now')),
            ultimo_acceso TEXT
        )
    ''')
    
    # Agregar columna requiere_cambio_password si no existe (para bases de datos existentes)
    cursor.execute("PRAGMA table_info(usuarios)")
    columns = [column[1] for column in cursor.fetchall()]
    if 'requiere_cambio_password' not in columns:
        cursor.execute('ALTER TABLE usuarios ADD COLUMN requiere_cambio_password INTEGER DEFAULT 0')
        print('✅ Columna requiere_cambio_password agregada a la tabla usuarios')
    
    # Tabla de inventario
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS inventario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            numero_serie TEXT,
            descripcion TEXT,
            categoria TEXT,
            ubicacion TEXT,
            responsable TEXT,
            cantidad INTEGER DEFAULT 1,
            estado TEXT DEFAULT 'Disponible',
            fecha_agregado TEXT DEFAULT (DATETIME('now')),
            fecha_ultima_modificacion TEXT DEFAULT (DATETIME('now')),
            notas TEXT,
            creado_por INTEGER,
            modificado_por INTEGER,
            FOREIGN KEY (creado_por) REFERENCES usuarios(id),
            FOREIGN KEY (modificado_por) REFERENCES usuarios(id)
        )
    ''')
    
    # Tabla de historial
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS historial_inventario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_id INTEGER NOT NULL,
            usuario_id INTEGER NOT NULL,
            accion TEXT NOT NULL,
            cambios TEXT,
            fecha TEXT DEFAULT (DATETIME('now')),
            FOREIGN KEY (item_id) REFERENCES inventario(id),
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )
    ''')
    
    # Crear usuario admin por defecto si no existe
    cursor.execute('SELECT id FROM usuarios WHERE username = ?', ('admin',))
    if not cursor.fetchone():
        hashed_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        cursor.execute('''
            INSERT INTO usuarios (username, password, nombre_completo, email, rol, requiere_cambio_password)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', ('admin', hashed_password, 'Administrador', 'admin@malagaspaceteam.uma.es', 'admin', 0))
        print('✅ Usuario admin creado: admin/admin123')
    
    conn.commit()
    conn.close()

# ====================================
# DECORADORES DE AUTENTICACIÓN
# ====================================

def token_required(f):
    """Decorador para verificar token JWT"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('token')
        
        if not token:
            auth_header = request.headers.get('Authorization')
            if auth_header:
                token = auth_header.split(' ')[1] if ' ' in auth_header else None
        
        if not token:
            return jsonify({'error': 'Acceso no autorizado'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            request.user = data
            
            # Actualizar último acceso
            conn = get_db_connection()
            conn.execute('UPDATE usuarios SET ultimo_acceso = DATETIME("now") WHERE id = ?', (data['id'],))
            conn.commit()
            conn.close()
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 403
        
        return f(*args, **kwargs)
    
    return decorated

def role_required(roles):
    """Decorador para verificar roles de usuario"""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if request.user['rol'] not in roles:
                return jsonify({'error': 'Permisos insuficientes'}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator

# ====================================
# RUTAS DE AUTENTICACIÓN
# ====================================

@app.route('/api/inventory/login', methods=['POST'])
def login():
    """Login de usuario"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username y password son requeridos'}), 400
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM usuarios WHERE username = ? AND activo = 1', (username,)).fetchone()
    conn.close()
    
    if not user:
        return jsonify({'error': 'Credenciales inválidas'}), 401
    
    # Verificar contraseña con bcrypt
    if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({'error': 'Credenciales inválidas'}), 401
    
    # Verificar si requiere cambio de contraseña
    requiere_cambio = bool(user['requiere_cambio_password'])
    
    # Generar token JWT
    token = jwt.encode({
        'id': user['id'],
        'username': user['username'],
        'rol': user['rol'],
        'requiere_cambio_password': requiere_cambio,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    
    # Crear respuesta con cookie
    response = make_response(jsonify({
        'success': True,
        'requiere_cambio_password': requiere_cambio,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'nombre_completo': user['nombre_completo'],
            'rol': user['rol']
        }
    }))
    
    response.set_cookie(
        'token',
        token,
        httponly=True,
        secure=False,  # True en producción con HTTPS
        samesite='Lax',
        max_age=8 * 60 * 60  # 8 horas
    )
    
    return response

@app.route('/api/inventory/logout', methods=['POST'])
def logout():
    """Logout de usuario"""
    response = make_response(jsonify({'success': True}))
    response.set_cookie('token', '', expires=0)
    return response

@app.route('/api/inventory/verify', methods=['GET'])
@token_required
def verify():
    """Verificar sesión activa"""
    conn = get_db_connection()
    user = conn.execute('SELECT id, username, nombre_completo, rol, requiere_cambio_password FROM usuarios WHERE id = ?', 
                       (request.user['id'],)).fetchone()
    conn.close()
    
    return jsonify({
        'success': True,
        'user': dict(user)
    })

@app.route('/api/inventory/change-password', methods=['POST'])
@token_required
def change_password():
    """Cambiar contraseña de usuario"""
    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    
    if not current_password or not new_password:
        return jsonify({'error': 'Contraseña actual y nueva son requeridas'}), 400
    
    if len(new_password) < 6:
        return jsonify({'error': 'La contraseña debe tener al menos 6 caracteres'}), 400
    
    conn = get_db_connection()
    user = conn.execute('SELECT password FROM usuarios WHERE id = ?', (request.user['id'],)).fetchone()
    
    if not user:
        conn.close()
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    # Verificar contraseña actual
    if not bcrypt.checkpw(current_password.encode('utf-8'), user['password'].encode('utf-8')):
        conn.close()
        return jsonify({'error': 'Contraseña actual incorrecta'}), 401
    
    # Hash de la nueva contraseña
    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Actualizar contraseña y quitar flag de cambio obligatorio
    conn.execute('''
        UPDATE usuarios 
        SET password = ?, requiere_cambio_password = 0 
        WHERE id = ?
    ''', (hashed_password, request.user['id']))
    
    conn.commit()
    conn.close()
    
    return jsonify({
        'success': True,
        'message': 'Contraseña actualizada correctamente'
    })

# ====================================
# RUTAS DE INVENTARIO
# ====================================

@app.route('/api/inventory/items', methods=['GET'])
@token_required
def get_items():
    """Obtener todos los items con búsqueda opcional"""
    search = request.args.get('search', '')
    
    conn = get_db_connection()
    
    if search:
        query = '''
            SELECT * FROM inventario 
            WHERE nombre LIKE ? OR numero_serie LIKE ? OR descripcion LIKE ?
            OR ubicacion LIKE ? OR responsable LIKE ?
            ORDER BY fecha_agregado DESC
        '''
        search_term = f'%{search}%'
        items = conn.execute(query, (search_term, search_term, search_term, search_term, search_term)).fetchall()
    else:
        items = conn.execute('SELECT * FROM inventario ORDER BY fecha_agregado DESC').fetchall()
    
    conn.close()
    
    return jsonify({
        'success': True,
        'items': [dict(item) for item in items]
    })

@app.route('/api/inventory/items/<int:item_id>', methods=['GET'])
@token_required
def get_item(item_id):
    """Obtener un item específico"""
    conn = get_db_connection()
    item = conn.execute('SELECT * FROM inventario WHERE id = ?', (item_id,)).fetchone()
    conn.close()
    
    if not item:
        return jsonify({'error': 'Item no encontrado'}), 404
    
    return jsonify(dict(item))

@app.route('/api/inventory/items', methods=['POST'])
@token_required
@role_required(['manager', 'admin'])
def create_item():
    """Crear nuevo item"""
    data = request.get_json()
    
    if not data.get('nombre'):
        return jsonify({'error': 'El nombre es requerido'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO inventario (
            nombre, numero_serie, descripcion, categoria, ubicacion,
            responsable, cantidad, estado, notas, creado_por, modificado_por
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get('nombre'),
        data.get('numero_serie'),
        data.get('descripcion'),
        data.get('categoria'),
        data.get('ubicacion'),
        data.get('responsable'),
        data.get('cantidad', 1),
        data.get('estado', 'Disponible'),
        data.get('notas'),
        request.user['id'],
        request.user['id']
    ))
    
    item_id = cursor.lastrowid
    
    # Registrar en historial
    cursor.execute('''
        INSERT INTO historial_inventario (item_id, usuario_id, accion, cambios)
        VALUES (?, ?, 'crear', ?)
    ''', (item_id, request.user['id'], f'Item creado: {data.get("nombre")}'))
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'id': item_id}), 201

@app.route('/api/inventory/items/<int:item_id>', methods=['PUT'])
@token_required
@role_required(['manager', 'admin'])
def update_item(item_id):
    """Actualizar item existente"""
    data = request.get_json()
    
    conn = get_db_connection()
    
    # Verificar que el item existe
    item = conn.execute('SELECT * FROM inventario WHERE id = ?', (item_id,)).fetchone()
    if not item:
        conn.close()
        return jsonify({'error': 'Item no encontrado'}), 404
    
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE inventario SET
            nombre = ?, numero_serie = ?, descripcion = ?, categoria = ?,
            ubicacion = ?, responsable = ?, cantidad = ?, estado = ?,
            notas = ?, modificado_por = ?,
            fecha_ultima_modificacion = DATETIME('now')
        WHERE id = ?
    ''', (
        data.get('nombre'),
        data.get('numero_serie'),
        data.get('descripcion'),
        data.get('categoria'),
        data.get('ubicacion'),
        data.get('responsable'),
        data.get('cantidad', 1),
        data.get('estado', 'Disponible'),
        data.get('notas'),
        request.user['id'],
        item_id
    ))
    
    # Registrar en historial
    cursor.execute('''
        INSERT INTO historial_inventario (item_id, usuario_id, accion, cambios)
        VALUES (?, ?, 'actualizar', ?)
    ''', (item_id, request.user['id'], f'Item actualizado: {data.get("nombre")}'))
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/inventory/items/<int:item_id>', methods=['DELETE'])
@token_required
@role_required(['admin'])
def delete_item(item_id):
    """Eliminar item (solo admin)"""
    conn = get_db_connection()
    
    # Verificar que el item existe
    item = conn.execute('SELECT nombre FROM inventario WHERE id = ?', (item_id,)).fetchone()
    if not item:
        conn.close()
        return jsonify({'error': 'Item no encontrado'}), 404
    
    cursor = conn.cursor()
    
    # Registrar en historial antes de eliminar
    cursor.execute('''
        INSERT INTO historial_inventario (item_id, usuario_id, accion, cambios)
        VALUES (?, ?, 'eliminar', ?)
    ''', (item_id, request.user['id'], f'Item eliminado: {item["nombre"]}'))
    
    # Eliminar item
    cursor.execute('DELETE FROM inventario WHERE id = ?', (item_id,))
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/inventory/stats', methods=['GET'])
@token_required
def get_stats():
    """Obtener estadísticas del inventario"""
    conn = get_db_connection()
    
    total_items = conn.execute('SELECT COUNT(*) as count FROM inventario').fetchone()['count']
    
    by_category = conn.execute('SELECT categoria, COUNT(*) as count FROM inventario GROUP BY categoria').fetchall()
    by_status = conn.execute('SELECT estado, COUNT(*) as count FROM inventario GROUP BY estado').fetchall()
    by_location = conn.execute('SELECT ubicacion, COUNT(*) as count FROM inventario GROUP BY ubicacion').fetchall()
    
    conn.close()
    
    return jsonify({
        'success': True,
        'stats': {
            'totalItems': total_items,
            'byCategory': [dict(row) for row in by_category],
            'byStatus': [dict(row) for row in by_status],
            'byLocation': [dict(row) for row in by_location]
        }
    })

@app.route('/api/inventory/items/<int:item_id>/history', methods=['GET'])
@token_required
def get_item_history(item_id):
    """Obtener historial de un item"""
    conn = get_db_connection()
    
    history = conn.execute('''
        SELECT h.*, u.nombre_completo as usuario_nombre
        FROM historial_inventario h
        JOIN usuarios u ON h.usuario_id = u.id
        WHERE h.item_id = ?
        ORDER BY h.fecha DESC
    ''', (item_id,)).fetchall()
    
    conn.close()
    
    return jsonify({
        'success': True,
        'history': [dict(row) for row in history]
    })

# ====================================
# RUTAS DE USUARIOS (solo admin)
# ====================================

@app.route('/api/inventory/users', methods=['GET'])
@token_required
@role_required(['admin'])
def get_users():
    """Listar todos los usuarios"""
    conn = get_db_connection()
    users = conn.execute('''
        SELECT id, username, nombre_completo, email, rol, activo, fecha_creacion, ultimo_acceso
        FROM usuarios
        ORDER BY fecha_creacion DESC
    ''').fetchall()
    conn.close()
    
    return jsonify({
        'success': True,
        'users': [dict(user) for user in users]
    })

@app.route('/api/inventory/users', methods=['POST'])
@token_required
@role_required(['admin'])
def create_user():
    """Crear nuevo usuario"""
    data = request.get_json()
    
    username = data.get('username')
    password = data.get('password')
    nombre_completo = data.get('nombre_completo')
    rol = data.get('rol')
    
    if not all([username, password, nombre_completo, rol]):
        return jsonify({'error': 'Todos los campos son requeridos'}), 400
    
    conn = get_db_connection()
    
    # Verificar si el usuario ya existe
    existing = conn.execute('SELECT id FROM usuarios WHERE username = ?', (username,)).fetchone()
    if existing:
        conn.close()
        return jsonify({'error': 'El username ya existe'}), 400
    
    # Crear usuario con hash bcrypt
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO usuarios (username, password, nombre_completo, email, rol)
        VALUES (?, ?, ?, ?, ?)
    ''', (username, hashed_password, nombre_completo, data.get('email'), rol))
    
    user_id = cursor.lastrowid
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'id': user_id}), 201

@app.route('/api/inventory/users/<int:user_id>', methods=['PUT'])
@token_required
@role_required(['admin'])
def update_user(user_id):
    """Actualizar usuario"""
    data = request.get_json()

    conn = get_db_connection()
    cursor = conn.cursor()

    # Verificar si el usuario existe
    user = cursor.execute('SELECT * FROM usuarios WHERE id = ?', (user_id,)).fetchone()
    if not user:
        conn.close()
        return jsonify({'error': 'Usuario no encontrado'}), 404

    # Si se actualiza el password
    if 'password' in data and data['password']:
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        cursor.execute('UPDATE usuarios SET password = ? WHERE id = ?', (hashed_password, user_id))

    # Actualizar otros campos
    campos = []
    valores = []

    if 'nombre_completo' in data:
        campos.append('nombre_completo = ?')
        valores.append(data['nombre_completo'])

    if 'email' in data:
        campos.append('email = ?')
        valores.append(data['email'])

    if 'rol' in data:
        campos.append('rol = ?')
        valores.append(data['rol'])

    if 'activo' in data:
        campos.append('activo = ?')
        valores.append(data['activo'])

    if campos:
        valores.append(user_id)
        cursor.execute(f'UPDATE usuarios SET {", ".join(campos)} WHERE id = ?', tuple(valores))

    conn.commit()
    conn.close()

    return jsonify({'success': True})

@app.route('/api/inventory/users/<int:user_id>', methods=['DELETE'])
@token_required
@role_required(['admin'])
def delete_user(user_id):
    """Eliminar usuario"""
    # Evitar eliminar al propio usuario admin actual
    if user_id == request.user['id']:
         return jsonify({'error': 'No puedes eliminar tu propio usuario'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Verificar si el usuario existe
    user = cursor.execute('SELECT * FROM usuarios WHERE id = ?', (user_id,)).fetchone()
    if not user:
        conn.close()
        return jsonify({'error': 'Usuario no encontrado'}), 404

    cursor.execute('DELETE FROM usuarios WHERE id = ?', (user_id,))

    conn.commit()
    conn.close()

    return jsonify({'success': True})

# ====================================
# INICIALIZACIÓN
# ====================================

if __name__ == '__main__':
    print('\n' + '='*50)
    print('🚀 Servidor de Inventario Flask')
    print('='*50)
    
    # Inicializar base de datos
    init_database()
    
    print(f'\n📊 Base de datos: {DATABASE_PATH}')
    print('\n👤 Credenciales por defecto:')
    print('   Usuario: admin')
    print('   Contraseña: admin123')
    print('\n🔐 Roles disponibles:')
    print('   - viewer: Solo lectura')
    print('   - manager: Lectura + Crear/Editar')
    print('   - admin: Lectura + Crear/Editar + Eliminar + Gestión de usuarios')
    print('\n' + '='*50 + '\n')
    
    # Iniciar servidor
    app.run(host='0.0.0.0', port=3001, debug=True)
