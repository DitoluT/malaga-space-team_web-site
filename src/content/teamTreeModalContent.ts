// ====================================
// 👥 MIEMBROS DEL EQUIPO
// ====================================
// Define aquí todos los miembros una sola vez
// Para añadir un nuevo miembro: añade una entrada aquí con sus datos

interface TeamMember {
  name: string;
  title: string;
  department?: string;
  roles: string[]; // Puede tener múltiples roles: 'director', 'coordinator', 'leader', 'engineer'
}

const teamMembers: TeamMember[] = [
  // Dirección
  {
    name: "Sergio Fortes",
    title: "Prof. Ingeniería de Comunicaciones",
    roles: ["director"],
  },
  {
    name: "Rafael Godoy",
    title: "Prof. Ingeniería de Comunicaciones",
    roles: ["director"],
  },

  // Coordinadores
  {
    name: "Paco Muro Correro",
    title: "PhD en Ingeniería de Telecomunicación",
    roles: ["coordinator"],
  },
  {
    name: "Pepe Pulido Alegre",
    title: "PhD en Ingeniería de Telecomunicación",
    roles: ["coordinator"],
  },

  // Líderes de Subsistema (pueden ser también ingenieros)
  {
    name: "Diego Toledo Luque",
    title: "Doble Grado en Ing. Informática y Matemáticas",
    department: "OBDH",
    roles: ["leader", "engineer"],
  },
  {
    name: "Ramón Montoro Mazuela",
    title: "Ing. Tecnologías de Telecomunicación",
    department: "EstacionTerrena",
    roles: ["leader", "engineer"],
  },
  {
    name: "Candela Ríos González",
    title: "Ing. Tecnologías de Telecomunicación",
    department: "Comms",
    roles: ["leader", "engineer"],
  },
  {
    name: "Lidia Ramírez Arroyo",
    title: "Ing. Electrónica, Robótica y Mecatrónica",
    department: "Estructura",
    roles: ["leader"],
  },

  // Ingenieros
  {
    name: "Isabel Antúnez Rodríguez",
    title: "Doble Grado en Ing. Mecánica e Ing. de Diseño Industrial y Desarrollo del Producto",
    department: "Estructura",
    roles: ["engineer"],
  },
  {
    name: "Carlos Braos García",
    title: "Doble Grado en Ing. Mecánica e Ing. de Diseño Industrial y Desarrollo del Producto",
    department: "Estructura",
    roles: ["engineer"],
  },
  {
    name: "Matías López Lovera",
    title: "Doble Grado en Ing. de Tecnologías de Telecomunicación y Matemáticas",
    department: "OBDH",
    roles: ["engineer"],
  },
  {
    name: "Antonio Trujillo Reino",
    title: "Doble Grado en Ing. Informática y Matemáticas",
    department: "OBDH",
    roles: ["engineer"],
  },
  {
    name: "David Ruiz Del Castillo",
    title: "Ing. Tecnologías de Telecomunicación",
    department: "EstacionTerrena",
    roles: ["engineer"],
  },
  {
    name: "Lola Ruiz Verdugo",
    title: "Ing. Sistemas de Telecomunicación",
    department: "EstacionTerrena",
    roles: ["engineer"],
  },
  {
    name: "Juan Antonio García Molina",
    title: "Ing. Sistemas de Telecomunicación",
    department: "EstacionTerrena",
    roles: ["engineer"],
  },
  {
    name: "Fernando Moya Gómez",
    title: "Doble Grado en Ing. de Tecnologías de Telecomunicación y Matemáticas",
    department: "Comms",
    roles: ["engineer"],
  },
  {
    name: "Miguel Ángel Ruano Zayas",
    title: "Ing. Telemática",
    department: "Comms",
    roles: ["engineer"],
  },
  {
    name: "Salud Gil-Cepeda Gómez",
    title: "Doble Grado en Ing. de Tecnologías de Telecomunicación y Matemáticas",
    department: "Comms",
    roles: ["engineer"],
  },
  {
    name: "Pedro García Jimenez",
    title: "Ing. Sistemas de Telecomunicación",
    department: "Comms",
    roles: ["engineer"],
  },
  {
    name: "Yousuf Harkaoui Ftili",
    title: "Ing. Sistemas de Telecomunicación",
    department: "Comms",
    roles: ["engineer"],
  },
];

// ====================================
// 📋 MAPEO DE ROLES Y DEPARTAMENTOS
// ====================================

const departmentDisplayNames: Record<string, string> = {
  "OBDH": "Sistema de Control y Software",
  "Comms": "Comunicaciones",
  "EPS": "Sistema de Energía",
  "Estructura": "Estructura",
  "EstacionTerrena": "Estación Terrena"
};

const leaderRoleNames: Record<string, string> = {
  "OBDH": "Líder Equipo de Sistemas de Control y Software",
  "Comms": "Líder Equipo Comunicaciones",
  "Estructura": "Líder Equipo de Estructura y Energía",
  "EstacionTerrena": "Líder Equipo de Estación Terrena",
  "EPS": "Líder Equipo de Energía"
};

// ====================================
// 🎯 GENERACIÓN AUTOMÁTICA DE LISTAS
// ====================================

const getDirectors = () => teamMembers
  .filter(m => m.roles.includes("director"))
  .map(m => ({
    name: m.name,
    role: m.name.includes("Co-Director") ? "Co-Director" : "IP y Co-Director del Proyecto",
    department: m.title,
    title: ""
  }));

const getCoordinators = () => teamMembers
  .filter(m => m.roles.includes("coordinator"))
  .map(m => ({
    name: m.name,
    role: "Coordinador del Proyecto",
    department: "",
    title: m.title
  }));

const getSubsystemLeaders = () => teamMembers
  .filter(m => m.roles.includes("leader"))
  .map(m => ({
    name: m.name,
    role: leaderRoleNames[m.department || ""] || `Líder Equipo de ${m.department}`,
    department: departmentDisplayNames[m.department || ""] || m.department || "",
    title: m.title
  }));

const getDevelopmentTeam = () => teamMembers
  .filter(m => m.roles.includes("engineer"))
  .map(m => ({
    name: m.name,
    role: "Ingeniero",
    department: m.department || "",
    title: m.title
  }));

// ====================================
// 📦 EXPORTACIÓN
// ====================================

export const teamTreeModalContent = {
  title: "Organigrama del Equipo",
  description: "Estructura organizacional del Málaga Space Team",
  sections: {
    directors: "Dirección del Proyecto",
    coordinators: "Coordinadores del Proyecto",
    subsystemLeaders: "Líderes de Equipo",
    developmentTeam: "Equipo de Ingenieros"
  },
  departmentNames: departmentDisplayNames,
  directors: getDirectors(),
  coordinators: getCoordinators(),
  subsystemLeaders: getSubsystemLeaders(),
  developmentTeam: getDevelopmentTeam(),
  stats: {
    title: "Estadísticas del Equipo",
    members: "Ingenieros",
    departments: "Departamentos",
    disciplines: "Disciplinas",
    years: "Años"
  },
  closeButton: "Cerrar Organigrama"
};