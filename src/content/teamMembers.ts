/**
 * ====================================
 * 👥 MIEMBROS DEL EQUIPO
 * ====================================
 * 
 * Este archivo contiene la lista de todos los participantes del Málaga Space Team.
 * 
 * INSTRUCCIONES PARA AÑADIR UN NUEVO MIEMBRO:
 * --------------------------------------------
 * 1. Copia el último objeto de la lista
 * 2. Pega al final del array
 * 3. Incrementa el 'id' al siguiente número
 * 4. Modifica los campos con la información del nuevo miembro
 * 5. Guarda el archivo (Cmd/Ctrl + S)
 * 
 * CAMPOS DISPONIBLES:
 * ------------------
 * - id: Número único (OBLIGATORIO)
 * - name: Nombre completo (OBLIGATORIO)
 * - role: Cargo en el equipo (OBLIGATORIO)
 * - department: Departamento académico (OBLIGATORIO)
 * - subsystem: Subsistema al que pertenece (OPCIONAL)
 * - image: Ruta a la foto en /public/team/ (OPCIONAL)
 * - email: Email de contacto (OPCIONAL)
 * - linkedin: URL perfil LinkedIn (OPCIONAL)
 * - github: URL perfil GitHub (OPCIONAL)
 * - bio: Biografía breve 150-200 caracteres (OPCIONAL)
 * - active: true si está activo, false si es alumni (OPCIONAL, por defecto true)
 * 
 * SUBSISTEMAS DISPONIBLES:
 * -----------------------
 * - "Estructura"
 * - "Energía"
 * - "ADCS"
 * - "CDHS"
 * - "Carga Útil"
 * - "Comunicaciones"
 * - "Gestión"
 * 
 * DEPARTAMENTOS:
 * -------------
 * - "Ingeniería Aeroespacial"
 * - "Ingeniería de Telecomunicaciones"
 * - "Ingeniería Informática"
 * - "Ingeniería Electrónica"
 * - "Ingeniería Mecánica"
 * - "Física"
 * - "Matemáticas"
 * - "Diseño Industrial"
 * - "Gestión"
 */

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
  subsystem?: string;
  image?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  bio?: string;
  active?: boolean;
}

export const teamMembers: TeamMember[] = [
  // ========================================
  // 👑 LIDERAZGO Y COORDINACIÓN
  // ========================================
  {
    id: 1,
    name: "Diego Torres",
    role: "Project Manager",
    department: "Ingeniería de Telecomunicaciones",
    subsystem: "Gestión",
    // image: "/team/diego-torres.jpg",
    // email: "diego.torres@uma.es",
    // linkedin: "https://linkedin.com/in/diego-torres",
    bio: "Coordinador general del proyecto, responsable de la planificación y gestión del equipo.",
    active: true
  },
  {
    id: 2,
    name: "María García López",
    role: "Responsable Técnico",
    department: "Ingeniería Aeroespacial",
    subsystem: "CDHS",
    // image: "/team/maria-garcia.jpg",
    bio: "Especialista en sistemas de control y arquitectura de satélites.",
    active: true
  },

  // ========================================
  // 🏗️ EQUIPO DE ESTRUCTURA
  // ========================================
  {
    id: 3,
    name: "Carlos Martínez",
    role: "Ingeniero de Estructura",
    department: "Ingeniería Mecánica",
    subsystem: "Estructura",
    bio: "Diseño CAD y análisis estructural del CubeSat.",
    active: true
  },
  {
    id: 4,
    name: "Ana Rodríguez",
    role: "Analista de Materiales",
    department: "Ingeniería Mecánica",
    subsystem: "Estructura",
    bio: "Selección de materiales y pruebas de resistencia.",
    active: true
  },

  // ========================================
  // ⚡ EQUIPO DE ENERGÍA
  // ========================================
  {
    id: 5,
    name: "Luis Fernández",
    role: "Ingeniero de Energía",
    department: "Ingeniería Electrónica",
    subsystem: "Energía",
    bio: "Sistemas de generación y almacenamiento de energía.",
    active: true
  },
  {
    id: 6,
    name: "Elena Sánchez",
    role: "Especialista en Baterías",
    department: "Ingeniería Electrónica",
    subsystem: "Energía",
    bio: "Gestión térmica y optimización de baterías Li-ion.",
    active: true
  },

  // ========================================
  // 🧭 EQUIPO DE ADCS
  // ========================================
  {
    id: 7,
    name: "Javier Ruiz",
    role: "Ingeniero ADCS",
    department: "Ingeniería Aeroespacial",
    subsystem: "ADCS",
    bio: "Desarrollo de algoritmos de control de actitud.",
    active: true
  },
  {
    id: 8,
    name: "Patricia Gómez",
    role: "Especialista en Sensores",
    department: "Física",
    subsystem: "ADCS",
    bio: "Calibración de magnetómetros y giroscopios.",
    active: true
  },

  // ========================================
  // 💻 EQUIPO DE CDHS
  // ========================================
  {
    id: 9,
    name: "Miguel Jiménez",
    role: "Ingeniero de Software",
    department: "Ingeniería Informática",
    subsystem: "CDHS",
    bio: "Desarrollo del software de vuelo y sistemas embebidos.",
    active: true
  },
  {
    id: 10,
    name: "Laura Moreno",
    role: "Ingeniera de Hardware",
    department: "Ingeniería Electrónica",
    subsystem: "CDHS",
    bio: "Diseño de circuitos y procesadores del sistema de control.",
    active: true
  },

  // ========================================
  // 🛰️ EQUIPO DE CARGA ÚTIL
  // ========================================
  {
    id: 11,
    name: "Roberto Díaz",
    role: "Ingeniero de Payload",
    department: "Ingeniería de Telecomunicaciones",
    subsystem: "Carga Útil",
    bio: "Integración de instrumentos científicos y sensores.",
    active: true
  },
  {
    id: 12,
    name: "Carmen Navarro",
    role: "Especialista en Óptica",
    department: "Física",
    subsystem: "Carga Útil",
    bio: "Calibración de cámaras multiespectrales.",
    active: true
  },

  // ========================================
  // 📡 EQUIPO DE COMUNICACIONES
  // ========================================
  {
    id: 13,
    name: "Antonio Pérez",
    role: "Ingeniero de Comunicaciones",
    department: "Ingeniería de Telecomunicaciones",
    subsystem: "Comunicaciones",
    bio: "Diseño del enlace de comunicación UHF/VHF.",
    active: true
  },
  {
    id: 14,
    name: "Isabel Castro",
    role: "Especialista en RF",
    department: "Ingeniería de Telecomunicaciones",
    subsystem: "Comunicaciones",
    bio: "Pruebas de antenas y análisis de radiofrecuencia.",
    active: true
  },

  // ========================================
  // 🎨 EQUIPO DE COMUNICACIÓN Y DISEÑO
  // ========================================
  {
    id: 15,
    name: "Sara Molina",
    role: "Diseñadora Gráfica",
    department: "Diseño Industrial",
    subsystem: "Gestión",
    bio: "Identidad visual y material de difusión del proyecto.",
    active: true
  },
  {
    id: 16,
    name: "David Ortiz",
    role: "Responsable de Comunicación",
    department: "Gestión",
    subsystem: "Gestión",
    bio: "Redes sociales, eventos y relaciones públicas.",
    active: true
  },

  // ========================================
  // 🎓 INVESTIGADORES Y PROFESORES
  // ========================================
  {
    id: 17,
    name: "Dr. Francisco López",
    role: "Director Académico",
    department: "Ingeniería de Telecomunicaciones",
    bio: "Supervisor académico y coordinador de investigación.",
    active: true
  },
  {
    id: 18,
    name: "Dra. Alicia Ramírez",
    role: "Investigadora Principal",
    department: "Ingeniería Aeroespacial",
    bio: "Especialista en sistemas espaciales y CubeSats.",
    active: true
  },

  // ========================================
  // 📝 EJEMPLO DE CÓMO AÑADIR MÁS MIEMBROS
  // ========================================
  // Descomenta y modifica este ejemplo para añadir nuevos miembros:
  /*
  {
    id: 19, // Incrementa este número
    name: "Nombre Apellido",
    role: "Cargo en el Equipo",
    department: "Departamento Académico",
    subsystem: "Subsistema", // Opcional
    image: "/team/nombre-apellido.jpg", // Opcional
    email: "email@uma.es", // Opcional
    linkedin: "https://linkedin.com/in/usuario", // Opcional
    github: "https://github.com/usuario", // Opcional
    bio: "Breve descripción de la persona y su rol...", // Opcional
    active: true // true = activo, false = alumni
  },
  */
];

// ========================================
// 🔧 FUNCIONES AUXILIARES
// ========================================

/**
 * Obtiene todos los miembros activos del equipo
 */
export const getActiveMembers = (): TeamMember[] => {
  return teamMembers.filter(member => member.active !== false);
};

/**
 * Obtiene miembros por subsistema
 */
export const getMembersBySubsystem = (subsystem: string): TeamMember[] => {
  return teamMembers.filter(member => member.subsystem === subsystem && member.active !== false);
};

/**
 * Obtiene miembros por departamento
 */
export const getMembersByDepartment = (department: string): TeamMember[] => {
  return teamMembers.filter(member => member.department === department && member.active !== false);
};

/**
 * Obtiene el total de miembros activos
 */
export const getTotalActiveMembers = (): number => {
  return getActiveMembers().length;
};

/**
 * Obtiene todos los subsistemas únicos
 */
export const getUniqueSubsystems = (): string[] => {
  const subsystems = teamMembers
    .filter(member => member.subsystem)
    .map(member => member.subsystem as string);
  return [...new Set(subsystems)];
};

/**
 * Obtiene todos los departamentos únicos
 */
export const getUniqueDepartments = (): string[] => {
  const departments = teamMembers.map(member => member.department);
  return [...new Set(departments)];
};
