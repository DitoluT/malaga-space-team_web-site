/**
 * ====================================
 * 📝 PLANTILLA PARA NUEVO MIEMBRO
 * ====================================
 * 
 * Copia este formato y pégalo en src/content/teamMembers.ts
 * al final del array teamMembers (antes del corchete de cierre).
 * 
 * IMPORTANTE:
 * - Incrementa el número de 'id' al siguiente disponible
 * - Rellena al menos: name, role, department
 * - Los campos marcados con (OPCIONAL) puedes dejarlos vacíos o eliminarlos
 * - No olvides la coma al final del objeto
 */

{
  id: 99,  // ⚠️ Cambia este número al siguiente disponible
  
  // INFORMACIÓN BÁSICA (OBLIGATORIO)
  name: "Nombre Completo",
  role: "Cargo en el Equipo",
  department: "Departamento Académico",
  
  // ORGANIZACIÓN (OPCIONAL)
  subsystem: "Nombre del Subsistema",  // Estructura | Energía | ADCS | CDHS | Carga Útil | Comunicaciones | Gestión
  
  // IMAGEN (OPCIONAL)
  // 1. Guarda la foto en: /public/team/nombre-apellido.jpg
  // 2. Descomenta la línea de abajo y cambia el nombre
  // image: "/team/nombre-apellido.jpg",
  
  // CONTACTO (OPCIONAL)
  // email: "email@uma.es",
  // linkedin: "https://linkedin.com/in/usuario",
  // github: "https://github.com/usuario",
  
  // BIOGRAFÍA (OPCIONAL)
  // Máximo 200 caracteres recomendado
  bio: "Breve descripción del miembro y su rol en el proyecto...",
  
  // ESTADO (OPCIONAL)
  active: true  // true = miembro activo | false = alumni
},

/**
 * EJEMPLO COMPLETO:
 * ================
 */

{
  id: 19,
  name: "Ana Martínez García",
  role: "Ingeniera de Software",
  department: "Ingeniería Informática",
  subsystem: "CDHS",
  image: "/team/ana-martinez.jpg",
  email: "ana.martinez@uma.es",
  linkedin: "https://linkedin.com/in/ana-martinez",
  bio: "Desarrolladora de software embebido especializada en sistemas de tiempo real.",
  active: true
},

/**
 * EJEMPLO MÍNIMO:
 * ==============
 */

{
  id: 20,
  name: "Pedro López",
  role: "Estudiante Investigador",
  department: "Ingeniería Aeroespacial",
  active: true
},
