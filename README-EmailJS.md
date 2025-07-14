# Configuración de EmailJS para el Formulario de Contacto

Este proyecto utiliza EmailJS para enviar emails desde el formulario de contacto del sitio web.

## Variables de Entorno Requeridas

Para que el formulario de contacto funcione correctamente, necesitas configurar las siguientes variables de entorno:

```bash
REACT_APP_EMAILJS_SERVICE_ID=tu_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=tu_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=tu_public_key
```

## Configuración de EmailJS

1. **Crea una cuenta en EmailJS**:
   - Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
   - Regístrate y crea una cuenta

2. **Configura un servicio de email**:
   - En el dashboard de EmailJS, ve a "Email Services"
   - Agrega un servicio (Gmail, Outlook, etc.)
   - Copia el `Service ID`

3. **Crea un template de email**:
   - Ve a "Email Templates" en el dashboard
   - Crea un nuevo template con los siguientes campos:
     - `{{name}}` - Nombre del usuario
     - `{{email}}` - Email del usuario
     - `{{subject}}` - Asunto del mensaje
     - `{{message}}` - Mensaje del usuario
   - Copia el `Template ID`

4. **Obtén tu Public Key**:
   - Ve a "Account" → "General" en el dashboard
   - Copia tu `Public Key`

## Configuración Local

Crea un archivo `.env` en la raíz del proyecto con las variables:

```bash
# .env
REACT_APP_EMAILJS_SERVICE_ID=service_xxxxxxx
REACT_APP_EMAILJS_TEMPLATE_ID=template_xxxxxxx
REACT_APP_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

## Funcionalidades del Formulario

El formulario de contacto incluye:

- ✅ Validación de campos requeridos
- ✅ Estados de carga ("Enviando...")
- ✅ Mensajes de éxito y error
- ✅ Reset del formulario después del envío exitoso
- ✅ Manejo de errores de configuración
- ✅ Diseño responsive con glass effect

## Troubleshooting

**Error: "process is not defined"**
- Esto indica que las variables de entorno no están configuradas
- Asegúrate de crear el archivo `.env` con las variables necesarias

**Error: "EmailJS configuration is missing"**
- Verifica que todas las variables de entorno estén definidas
- Reinicia el servidor de desarrollo después de agregar las variables

**Error al enviar el email**
- Verifica que el Service ID, Template ID y Public Key sean correctos
- Asegúrate de que el servicio de email esté configurado correctamente en EmailJS
- Verifica que el template tenga los campos correctos