# 🚀 Guía de Despliegue en Nginx

## Problema Resuelto
El error "Not Found" en `/inventario` se debe a que Nginx no sabe que debe servir el archivo `inventario.html` cuando accedes a esa ruta.

## ✅ Solución Implementada

### 1. Configuración de Vite
Se ha actualizado `vite.config.ts` para generar múltiples puntos de entrada:
- `index.html` → Página principal
- `inventario.html` → Sistema de inventario

### 2. Build del Proyecto

```bash
# Opción 1: Build manual
npm run build

# Opción 2: Usar el script automático
chmod +x build-for-nginx.sh
./build-for-nginx.sh
```

Esto generará la carpeta `dist/` con ambos archivos HTML.

### 3. Configuración de Nginx

#### Paso 1: Copiar archivos al servidor
```bash
# Método A: Copia local (si estás en el servidor)
sudo cp -r dist/* /var/www/malaga-space-team/

# Método B: Copia remota (desde tu máquina)
scp -r dist/* usuario@servidor:/var/www/malaga-space-team/
```

#### Paso 2: Configurar Nginx
```bash
# Copia la configuración de Nginx incluida
sudo cp nginx.conf /etc/nginx/sites-available/malaga-space-team

# Edita el archivo para actualizar:
# - server_name (tu dominio)
# - root (ruta completa a tu carpeta dist)
sudo nano /etc/nginx/sites-available/malaga-space-team

# Crea el symlink
sudo ln -s /etc/nginx/sites-available/malaga-space-team /etc/nginx/sites-enabled/

# Verifica la configuración
sudo nginx -t

# Reinicia Nginx
sudo systemctl restart nginx
```

### 4. Configuración del Backend (Flask)

El backend del inventario debe estar corriendo en el servidor:

```bash
# Instalar dependencias
cd /ruta/a/tu/proyecto
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Iniciar backend (en segundo plano con systemd es lo ideal)
./backend.sh

# O crear un servicio systemd (recomendado para producción)
```

#### Crear servicio systemd para el backend:
```bash
sudo nano /etc/systemd/system/malaga-inventory-backend.service
```

Contenido del servicio:
```ini
[Unit]
Description=Málaga Space Team - Inventory Backend
After=network.target

[Service]
Type=simple
User=tu-usuario
WorkingDirectory=/ruta/a/tu/proyecto
Environment="PATH=/ruta/a/tu/proyecto/venv/bin"
ExecStart=/ruta/a/tu/proyecto/venv/bin/python /ruta/a/tu/proyecto/src/server/inventory_server.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Activar el servicio:
```bash
sudo systemctl daemon-reload
sudo systemctl enable malaga-inventory-backend
sudo systemctl start malaga-inventory-backend
sudo systemctl status malaga-inventory-backend
```

## 🔍 Verificación

### Archivos en dist/ después del build:
```
dist/
├── index.html              ✓ Página principal
├── inventario.html         ✓ Sistema de inventario
├── assets/
│   ├── index-[hash].js
│   ├── inventario-[hash].js
│   ├── index-[hash].css
│   └── ...
└── public/
    └── ...
```

### URLs disponibles:
- `http://tu-dominio.com/` → Página principal
- `http://tu-dominio.com/inventario` → Sistema de inventario
- `http://tu-dominio.com/api/inventory/*` → Backend API (proxied)

## 🐛 Troubleshooting

### Error: "Not Found" en /inventario
**Causa**: Nginx no está configurado correctamente
**Solución**: Verifica que la configuración de Nginx incluya:
```nginx
location = /inventario {
    try_files /inventario.html /inventario.html;
}
```

### Error: "inventario.html not found" después del build
**Causa**: Vite no está configurado para generar múltiples HTML
**Solución**: Verifica que `vite.config.ts` tenga:
```typescript
build: {
  rollupOptions: {
    input: {
      main: './index.html',
      inventario: './inventario.html',
    },
  },
}
```

### Error: "Failed to fetch" en el inventario
**Causa**: El backend no está corriendo o CORS está mal configurado
**Solución**: 
1. Verifica que el backend esté corriendo: `curl http://localhost:3001/api/inventory/verify`
2. Verifica CORS en `inventory_server.py`
3. Verifica el proxy de Nginx en `/api/inventory`

### Error: "Cannot connect to backend"
**Causa**: El proxy de Nginx no está configurado
**Solución**: Verifica en `nginx.conf`:
```nginx
location /api/inventory {
    proxy_pass http://localhost:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## 📝 Notas Importantes

1. **Base de datos**: La base de datos SQLite está en `src/database/inventory.db`. Asegúrate de que:
   - El usuario de Nginx tenga permisos de lectura
   - El usuario del backend tenga permisos de escritura
   - La carpeta exista: `mkdir -p src/database`

2. **Permisos**:
```bash
# Permisos para la carpeta web
sudo chown -R www-data:www-data /var/www/malaga-space-team

# Permisos para la base de datos
sudo chown tu-usuario:tu-usuario src/database/inventory.db
chmod 664 src/database/inventory.db
```

3. **Firewall**: Asegúrate de que los puertos estén abiertos:
```bash
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3001/tcp  # Backend (solo si no usas proxy)
```

4. **SSL/HTTPS**: Para producción, usa Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

## 📞 Soporte

Si sigues teniendo problemas:
1. Verifica los logs de Nginx: `sudo tail -f /var/log/nginx/error.log`
2. Verifica los logs del backend: `journalctl -u malaga-inventory-backend -f`
3. Verifica la consola del navegador (F12)
