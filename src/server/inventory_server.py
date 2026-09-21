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
from werkzeug.utils import secure_filename
import bcrypt
import sqlite3
import jwt
import datetime
import os
import re
import secrets
import uuid
from functools import wraps

app = Flask(__name__)

# Configuración
app.config['SECRET_KEY'] = os.environ.get('JWT_SECRET', 'malaga-space-team-secret-key-change-in-production')
DATABASE_PATH = os.environ.get('DATABASE_PATH', os.path.join(os.path.dirname(__file__), '../database/inventory.db'))

# Subidas (logos): tamaño máximo y tipos permitidos
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'}

# En producción (HTTPS) la cookie de sesión solo viaja cifrada
COOKIE_SECURE = os.environ.get('COOKIE_SECURE', 'false').lower() == 'true'

# CORS configuración
CORS(app, 
     origins=['http://localhost:5173', 'http://localhost', os.environ.get('FRONTEND_URL', '*')],
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

DEFAULT_COLLABORATORS = [
    {
        "name": "Universidad de Málaga",
        "short_name": "UMA",
        "description": "Institución pública española fundada en 1972 que ofrece más de 60 titulaciones de grado y más de 100 de posgrado, con cerca de 40,000 estudiantes y 2,450 profesores distribuidos en 19 centros universitarios.",
        "role": "Institución Principal",
        "contribution": "Apoyo institucional, infraestructura y recursos académicos",
        "description_en": "Spanish public institution founded in 1972 that offers more than 60 undergraduate degrees and more than 100 postgraduate degrees, with nearly 40,000 students and 2,450 professors distributed across 19 university centers.",
        "role_en": "Main Institution",
        "contribution_en": "Institutional support, infrastructure and academic resources",
        "website": "https://www.uma.es/"
    },
    {
        "name": "Mobile & Aerospace Networks Lab",
        "short_name": "MobileNet",
        "description": "Grupo de investigación especializado en redes de próxima generación e inteligencia artificial aplicada a redes inalámbricas. Cuenta con más de 30 investigadores y una infraestructura avanzada para el desarrollo tecnológico.",
        "role": "Laboratorio de Investigación",
        "contribution": "Expertise técnico, investigación y desarrollo tecnológico",
        "description_en": "Research group specialized in next-generation networks and artificial intelligence applied to wireless networks. It has more than 30 researchers and advanced infrastructure for technological development.",
        "role_en": "Research Laboratory",
        "contribution_en": "Technical expertise, research and technological development",
        "website": "https://mobilenet.uma.es/"
    },
    {
        "name": "LINK by UMA-ATech",
        "short_name": "Link Bayuma",
        "description": "Espacio de encuentro real entre la Universidad de Málaga y las empresas, dedicado a la innovación y el emprendimiento. Facilita la colaboración universidad-industria.",
        "role": "Hub de Innovación",
        "contribution": "Conexión industrial, transferencia de conocimiento y emprendimiento",
        "description_en": "Real meeting space between the University of Málaga and companies, dedicated to innovation and entrepreneurship. Facilitates university-industry collaboration.",
        "role_en": "Innovation Hub",
        "contribution_en": "Industrial connection, knowledge transfer and entrepreneurship",
        "website": "https://www.link.uma.es/"
    }
]

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

    # Tabla de Partners (Web)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS web_partners (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            logo_url TEXT,
            url TEXT,
            active INTEGER DEFAULT 1,
            display_order INTEGER DEFAULT 0
        )
    ''')

    # Tabla de Timeline (Web)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS web_timeline (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            year TEXT,
            phase_key TEXT,
            title TEXT,
            description TEXT,
            status TEXT,
            display_order INTEGER DEFAULT 0,
            details TEXT,
            active INTEGER DEFAULT 1
        )
    ''')

    # Tabla de Equipo (Web)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS web_team (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT,
            department TEXT,
            category TEXT,
            image_url TEXT,
            linkedin_url TEXT,
            github_url TEXT,
            email TEXT,
            active INTEGER DEFAULT 1,
            display_order INTEGER DEFAULT 0,
            title TEXT,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES usuarios(id)
        )
    ''')

    # Check for user_id column in existing table
    cursor.execute("PRAGMA table_info(web_team)")
    team_columns = [column[1] for column in cursor.fetchall()]
    if 'user_id' not in team_columns:
        cursor.execute('ALTER TABLE web_team ADD COLUMN user_id INTEGER REFERENCES usuarios(id)')
        print('✅ Columna user_id agregada a la tabla web_team')

    # Tabla de Sponsors/Collaborators (Web)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS web_sponsors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            short_name TEXT,
            description TEXT,
            role TEXT,
            icon TEXT,
            color TEXT,
            website TEXT,
            contribution TEXT,
            active INTEGER DEFAULT 1,
            display_order INTEGER DEFAULT 0,
            image_url TEXT
        )
    ''')

    # Check for image_url in web_sponsors
    cursor.execute("PRAGMA table_info(web_sponsors)")
    sponsor_columns = [column[1] for column in cursor.fetchall()]
    if 'image_url' not in sponsor_columns:
        cursor.execute('ALTER TABLE web_sponsors ADD COLUMN image_url TEXT')
        print('✅ Columna image_url agregada a la tabla web_sponsors')
    
    # Versión en inglés (opcional) de los textos que se muestran en la web
    for table, columns in {
        'web_team': ['role_en', 'title_en'],
        'web_sponsors': ['role_en', 'description_en', 'contribution_en'],
    }.items():
        cursor.execute(f'PRAGMA table_info({table})')
        existing = [column[1] for column in cursor.fetchall()]
        for column in columns:
            if column not in existing:
                cursor.execute(f'ALTER TABLE {table} ADD COLUMN {column} TEXT')

    # Colaboradores iniciales: se cargan una sola vez, para que aparezcan en /admin y se
    # puedan editar o borrar desde allí (si se borran, no vuelven a crearse)
    cursor.execute('CREATE TABLE IF NOT EXISTS web_meta (key TEXT PRIMARY KEY, value TEXT)')
    seeded = cursor.execute("SELECT 1 FROM web_meta WHERE key = 'sponsors_seeded'").fetchone()
    if not seeded:
        if cursor.execute('SELECT COUNT(*) FROM web_sponsors').fetchone()[0] == 0:
            for order, sponsor in enumerate(DEFAULT_COLLABORATORS):
                cursor.execute('''
                    INSERT INTO web_sponsors (name, short_name, description, role, website, contribution,
                                              description_en, role_en, contribution_en, active, display_order)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
                ''', (sponsor['name'], sponsor['short_name'], sponsor['description'], sponsor['role'],
                      sponsor['website'], sponsor['contribution'], sponsor['description_en'],
                      sponsor['role_en'], sponsor['contribution_en'], order))
        cursor.execute("INSERT INTO web_meta (key, value) VALUES ('sponsors_seeded', '1')")

    # Agregar columna requiere_cambio_password si no existe (para bases de datos existentes)
    cursor.execute("PRAGMA table_info(usuarios)")
    columns = [column[1] for column in cursor.fetchall()]
    if 'requiere_cambio_password' not in columns:
        cursor.execute('ALTER TABLE usuarios ADD COLUMN requiere_cambio_password INTEGER DEFAULT 0')
        print('✅ Columna requiere_cambio_password agregada a la tabla usuarios')

    # Migration for web_team title
    cursor.execute("PRAGMA table_info(web_team)")
    team_columns = [column[1] for column in cursor.fetchall()]
    if 'title' not in team_columns:
        cursor.execute('ALTER TABLE web_team ADD COLUMN title TEXT')
        print('✅ Columna title agregada a la tabla web_team')
    
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
    
    # Create uploads directory
    uploads_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'public/uploads')
    os.makedirs(uploads_dir, exist_ok=True)

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
        secure=COOKIE_SECURE,
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
# RUTAS DE UTILIDAD
# ====================================

@app.route('/api/upload', methods=['POST'])
@token_required
@role_required(['admin', 'manager'])
def upload_file():
    """Sube una imagen (logo) y devuelve su URL pública (/uploads/...)."""
    file = request.files.get('file')
    if not file or not file.filename:
        return jsonify({'error': 'No se ha enviado ningún fichero'}), 400

    extension = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else ''
    if extension not in ALLOWED_IMAGE_EXTENSIONS:
        permitidos = ', '.join(sorted(ALLOWED_IMAGE_EXTENSIONS))
        return jsonify({'error': f'Tipo de fichero no permitido. Usa una imagen: {permitidos}'}), 400

    # El nombre original no se conserva: evita colisiones y rutas raras
    unique_name = f'{uuid.uuid4().hex}.{extension}'

    # Este script está en src/server/; las subidas van a public/uploads/ (volumen compartido con nginx)
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    upload_folder = os.path.join(base_dir, 'public/uploads')
    os.makedirs(upload_folder, exist_ok=True)
    file.save(os.path.join(upload_folder, unique_name))

    return jsonify({'success': True, 'url': f'/uploads/{unique_name}'})


@app.errorhandler(413)
def file_too_large(_error):
    return jsonify({'error': 'El fichero es demasiado grande (máximo 10 MB)'}), 413


@app.errorhandler(500)
def internal_error(_error):
    return jsonify({'error': 'Error interno del servidor'}), 500

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
    
    # Quick Create Mode (Email only)
    if 'quick_email' in data:
        email = data['quick_email']
        if not email.endswith('@uma.es'):
            return jsonify({'error': 'El correo debe ser del dominio @uma.es'}), 400

        username = email.split('@')[0]
        password = 'spaceteam'
        nombre_completo = username # Default to username as alias
        rol = 'viewer' # Default role? Or member? Let's say viewer for safety, admin can upgrade.

        conn = get_db_connection()
        existing = conn.execute('SELECT id FROM usuarios WHERE username = ? OR email = ?', (username, email)).fetchone()
        if existing:
            conn.close()
            return jsonify({'error': 'El usuario o correo ya existe'}), 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO usuarios (username, password, nombre_completo, email, rol, requiere_cambio_password)
            VALUES (?, ?, ?, ?, ?, 1)
        ''', (username, hashed_password, nombre_completo, email, rol))

        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'id': user_id, 'message': 'Usuario creado. Contraseña temporal: spaceteam'}), 201

    # Standard Create Mode
    username = data.get('username')
    password = data.get('password')
    nombre_completo = data.get('nombre_completo')
    rol = data.get('rol')
    email = data.get('email')

    if email and not email.endswith('@uma.es'):
         return jsonify({'error': 'El correo debe ser del dominio @uma.es'}), 400
    
    # Sin contraseña: se genera una temporal aleatoria y se devuelve una sola vez
    temp_password = None
    if not password:
        temp_password = secrets.token_urlsafe(9)
        password = temp_password

    if not all([username, nombre_completo, rol]):
        return jsonify({'error': 'Nombre, usuario y rol son obligatorios'}), 400
    if rol not in ('viewer', 'manager', 'admin'):
        return jsonify({'error': 'Rol no válido'}), 400
    
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
        INSERT INTO usuarios (username, password, nombre_completo, email, rol, requiere_cambio_password)
        VALUES (?, ?, ?, ?, ?, 1)
    ''', (username, hashed_password, nombre_completo, email, rol))
    
    user_id = cursor.lastrowid
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'id': user_id, 'temp_password': temp_password}), 201

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

    # Restablecer contraseña: temporal aleatoria (se devuelve una sola vez) y cambio obligatorio
    temp_password = None
    if data.get('reset_password'):
        temp_password = secrets.token_urlsafe(9)
        data['password'] = temp_password

    # Si se actualiza el password
    if 'password' in data and data['password']:
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        cursor.execute('UPDATE usuarios SET password = ?, requiere_cambio_password = 1 WHERE id = ?', (hashed_password, user_id))

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

    return jsonify({'success': True, 'temp_password': temp_password})

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
# RUTAS DE GESTIÓN WEB (CMS)
# ====================================

# Contenido de la web pública que se gestiona desde /admin. Las tres secciones comparten
# la misma lógica; solo cambian la tabla y los campos.
#
#   team      -> miembros del equipo
#   sponsors  -> colaboradores (tarjetas con descripción)
#   partners  -> patrocinadores (logos)
#
# Tipos de campo: 'text' (longitud máxima), 'url' (http/https o ruta del sitio),
# 'email', 'bool' e 'int'.
WEB_CONTENT = {
    'team': {
        'table': 'web_team',
        'fields': {
            'name': ('text', 120), 'role': ('text', 120), 'role_en': ('text', 120),
            'title': ('text', 120), 'title_en': ('text', 120),
            'department': ('text', 40), 'category': ('text', 20),
            'linkedin_url': ('url', 300), 'github_url': ('url', 300), 'email': ('email', 200),
            'image_url': ('url', 300), 'user_id': ('int', None),
            'active': ('bool', None), 'display_order': ('int', None),
        },
        # Lo único que puede editar de su propia ficha un usuario vinculado que no es gestor
        'owner_fields': ['linkedin_url'],
    },
    'sponsors': {
        'table': 'web_sponsors',
        'fields': {
            'name': ('text', 160), 'short_name': ('text', 60),
            'role': ('text', 120), 'role_en': ('text', 120),
            'description': ('text', 1200), 'description_en': ('text', 1200),
            'contribution': ('text', 400), 'contribution_en': ('text', 400),
            'website': ('url', 300), 'image_url': ('url', 300),
            'icon': ('text', 40), 'color': ('text', 60),
            'active': ('bool', None), 'display_order': ('int', None),
        },
    },
    'partners': {
        'table': 'web_partners',
        'fields': {
            'name': ('text', 160), 'logo_url': ('url', 300), 'url': ('url', 300),
            'active': ('bool', None), 'display_order': ('int', None),
        },
    },
}

CONTENT_MANAGERS = ['admin', 'manager']
EMAIL_RE = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')


def clean_content_payload(kind, data, allowed=None):
    """Valida y normaliza los campos recibidos. Devuelve (valores, error)."""
    if not isinstance(data, dict):
        return None, 'Petición no válida'

    values = {}
    for field, (kind_of, max_length) in WEB_CONTENT[kind]['fields'].items():
        if field not in data or (allowed is not None and field not in allowed):
            continue
        value = data[field]

        if kind_of == 'bool':
            values[field] = 1 if value in (1, True, '1', 'true') else 0
            continue
        if kind_of == 'int':
            if value in (None, ''):
                values[field] = None
                continue
            try:
                values[field] = int(value)
            except (TypeError, ValueError):
                return None, f'El campo {field} debe ser un número'
            continue

        value = (value or '').strip() if isinstance(value, str) or value is None else str(value)
        if not value:
            values[field] = None
            continue
        if len(value) > max_length:
            return None, f'El campo {field} es demasiado largo (máximo {max_length} caracteres)'
        if kind_of == 'url':
            is_site_path = value.startswith('/') and not value.startswith('//')
            if not is_site_path and not re.match(r'^https?://[^\s]+$', value, re.IGNORECASE):
                return None, f'La dirección «{value}» no es válida: debe empezar por https://'
        if kind_of == 'email' and not EMAIL_RE.match(value):
            return None, f'El correo «{value}» no es válido'
        values[field] = value

    return values, None


def content_rows(kind, only_active):
    conn = get_db_connection()
    table = WEB_CONTENT[kind]['table']
    where = 'WHERE active = 1' if only_active else ''
    rows = conn.execute(f'SELECT * FROM {table} {where} ORDER BY display_order ASC, id ASC').fetchall()
    conn.close()
    return jsonify({'success': True, 'data': [dict(row) for row in rows]})


def register_web_content(kind):
    table = WEB_CONTENT[kind]['table']
    base = f'/api/web/{kind}'

    def list_public():
        return content_rows(kind, only_active=True)

    @token_required
    @role_required(CONTENT_MANAGERS)
    def list_all():
        """Para /admin: incluye los elementos ocultos"""
        return content_rows(kind, only_active=False)

    @token_required
    @role_required(CONTENT_MANAGERS)
    def create():
        values, error = clean_content_payload(kind, request.get_json(silent=True))
        if error:
            return jsonify({'error': error}), 400
        if not values.get('name'):
            return jsonify({'error': 'El nombre es obligatorio'}), 400

        conn = get_db_connection()
        if values.get('display_order') is None:
            # Lo nuevo va al final de la lista
            last = conn.execute(f'SELECT COALESCE(MAX(display_order), -1) FROM {table}').fetchone()[0]
            values['display_order'] = last + 1
        values.setdefault('active', 1)

        columns = ', '.join(values)
        marks = ', '.join('?' for _ in values)
        cursor = conn.execute(f'INSERT INTO {table} ({columns}) VALUES ({marks})', list(values.values()))
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()
        return jsonify({'success': True, 'id': new_id}), 201

    @token_required
    def update(id):
        conn = get_db_connection()
        row = conn.execute(f'SELECT * FROM {table} WHERE id = ?', (id,)).fetchone()
        if not row:
            conn.close()
            return jsonify({'error': 'Elemento no encontrado'}), 404

        is_manager = request.user['rol'] in CONTENT_MANAGERS
        is_owner = 'user_id' in row.keys() and row['user_id'] == request.user['id']
        if not (is_manager or is_owner):
            conn.close()
            return jsonify({'error': 'Permisos insuficientes'}), 403

        allowed = None if is_manager else WEB_CONTENT[kind].get('owner_fields', [])
        values, error = clean_content_payload(kind, request.get_json(silent=True), allowed)
        if error:
            conn.close()
            return jsonify({'error': error}), 400
        if 'name' in values and not values['name']:
            conn.close()
            return jsonify({'error': 'El nombre es obligatorio'}), 400

        # Actualización parcial: solo cambia lo que llega en la petición
        if values:
            assignments = ', '.join(f'{column} = ?' for column in values)
            conn.execute(f'UPDATE {table} SET {assignments} WHERE id = ?', [*values.values(), id])
            conn.commit()
        conn.close()
        return jsonify({'success': True})

    @token_required
    @role_required(CONTENT_MANAGERS)
    def delete(id):
        conn = get_db_connection()
        deleted = conn.execute(f'DELETE FROM {table} WHERE id = ?', (id,)).rowcount
        conn.commit()
        conn.close()
        if not deleted:
            return jsonify({'error': 'Elemento no encontrado'}), 404
        return jsonify({'success': True})

    @token_required
    @role_required(CONTENT_MANAGERS)
    def reorder():
        """Recibe {"ids": [...]} en el orden deseado y renumera display_order."""
        data = request.get_json(silent=True) or {}
        ids = data.get('ids')
        if not isinstance(ids, list) or not all(isinstance(i, int) for i in ids):
            return jsonify({'error': 'Se esperaba una lista de identificadores'}), 400
        conn = get_db_connection()
        for position, item_id in enumerate(ids):
            conn.execute(f'UPDATE {table} SET display_order = ? WHERE id = ?', (position, item_id))
        conn.commit()
        conn.close()
        return jsonify({'success': True})

    app.add_url_rule(base, f'{kind}_list_public', list_public, methods=['GET'])
    app.add_url_rule(f'{base}/all', f'{kind}_list_all', list_all, methods=['GET'])
    app.add_url_rule(base, f'{kind}_create', create, methods=['POST'])
    app.add_url_rule(f'{base}/reorder', f'{kind}_reorder', reorder, methods=['POST'])
    app.add_url_rule(f'{base}/<int:id>', f'{kind}_update', update, methods=['PUT'])
    app.add_url_rule(f'{base}/<int:id>', f'{kind}_delete', delete, methods=['DELETE'])


@app.route('/api/web/team/me', methods=['GET'])
@token_required
def get_my_team_member():
    """Ficha del equipo vinculada al usuario que ha iniciado sesión (si la hay)"""
    conn = get_db_connection()
    member = conn.execute('SELECT * FROM web_team WHERE user_id = ?', (request.user['id'],)).fetchone()
    conn.close()
    if member:
        return jsonify({'success': True, 'data': dict(member)})
    return jsonify({'success': False, 'message': 'No linked team member found'})


for _kind in WEB_CONTENT:
    register_web_content(_kind)

# --- TIMELINE ---

@app.route('/api/web/timeline', methods=['GET'])
def get_timeline():
    conn = get_db_connection()
    timeline = conn.execute('SELECT * FROM web_timeline WHERE active = 1 ORDER BY display_order ASC').fetchall()
    conn.close()
    return jsonify({'success': True, 'data': [dict(t) for t in timeline]})

@app.route('/api/web/timeline/all', methods=['GET'])
@token_required
@role_required(['admin', 'manager'])
def get_all_timeline():
    conn = get_db_connection()
    timeline = conn.execute('SELECT * FROM web_timeline ORDER BY display_order ASC').fetchall()
    conn.close()
    return jsonify({'success': True, 'data': [dict(t) for t in timeline]})

@app.route('/api/web/timeline', methods=['POST'])
@token_required
@role_required(['admin', 'manager'])
def create_timeline():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO web_timeline (year, phase_key, title, description, status, display_order, details, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get('year'), data.get('phase_key'), data.get('title'), data.get('description'),
        data.get('status', 'upcoming'), data.get('display_order', 0), data.get('details'), data.get('active', 1)
    ))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return jsonify({'success': True, 'id': new_id})

@app.route('/api/web/timeline/<int:id>', methods=['PUT'])
@token_required
@role_required(['admin', 'manager'])
def update_timeline(id):
    data = request.get_json()
    conn = get_db_connection()
    conn.execute('''
        UPDATE web_timeline SET year=?, phase_key=?, title=?, description=?, status=?, display_order=?, details=?, active=?
        WHERE id=?
    ''', (
        data.get('year'), data.get('phase_key'), data.get('title'), data.get('description'),
        data.get('status', 'upcoming'), data.get('display_order', 0), data.get('details'), data.get('active', 1), id
    ))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/web/timeline/<int:id>', methods=['DELETE'])
@token_required
@role_required(['admin'])
def delete_timeline(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM web_timeline WHERE id=?', (id,))
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
    app.run(host='0.0.0.0', port=3001, debug=os.environ.get('FLASK_ENV') == 'development')
