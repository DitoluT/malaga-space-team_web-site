/**
 * ====================================
 * 📋 ÍNDICE CENTRAL DE CONTENIDOS
 * ====================================
 * 
 * Este archivo es tu punto de partida para editar el contenido
 * de la página web del Málaga Space Team.
 * 
 * GUÍA RÁPIDA:
 * -----------
 * Haz clic en cualquiera de estos archivos para editar su contenido:
 * 
 * 🏠 PÁGINA PRINCIPAL
 * └─ heroContent.ts .................. Sección principal (título, descripción, botones)
 * 
 * 🎯 MISIÓN Y PROYECTO
 * ├─ missionContent.ts ............... Descripción de la misión y objetivos
 * └─ timelineContent.ts .............. Cronología y fases del proyecto
 * 
 * 👥 EQUIPO
 * ├─ teamMembers.ts .................. ⭐ LISTA DE PARTICIPANTES (¡Empieza aquí!)
 * ├─ teamContent.ts .................. Configuración general del equipo
 * ├─ teamTreeModalContent.ts ......... Organigrama del equipo
 * └─ joinTeamModalContent.ts ......... Modal de "Únete al equipo"
 * 
 * 🛰️ INFORMACIÓN TÉCNICA
 * ├─ subsystemsContent.ts ............ Subsistemas del CubeSat (detalles técnicos)
 * ├─ subsystemModalContent.ts ........ Contenido de modales de subsistemas
 * └─ statsContent.ts ................. Estadísticas del proyecto
 * 
 * 🤝 COLABORACIÓN
 * └─ sponsorsContent.ts .............. Patrocinadores y colaboradores
 * 
 * 📞 CONTACTO
 * ├─ contactContent.tsx .............. Información de contacto
 * └─ footerContent.ts ................ Pie de página (redes sociales, enlaces)
 * 
 * 🧭 NAVEGACIÓN
 * └─ navigationContent.ts ............ Menú de navegación
 * 
 * 
 * TAREAS COMUNES:
 * ==============
 * 
 * ✅ Añadir un nuevo participante:
 *    → Abre: src/content/teamMembers.ts
 *    → Busca el comentario "EJEMPLO DE CÓMO AÑADIR MÁS MIEMBROS"
 *    → Copia el formato y añade la nueva persona
 * 
 * ✅ Cambiar el texto de la página principal:
 *    → Abre: src/content/heroContent.ts
 *    → Edita title, subtitle, description
 * 
 * ✅ Actualizar la misión:
 *    → Abre: src/content/missionContent.ts
 *    → Modifica description o añade nuevas misiones
 * 
 * ✅ Añadir una fase a la cronología:
 *    → Abre: src/content/timelineContent.ts
 *    → Copia una fase existente y modifica los datos
 * 
 * ✅ Agregar un colaborador:
 *    → Abre: src/content/sponsorsContent.ts
 *    → Añade un nuevo objeto al array collaborators
 * 
 * ✅ Actualizar información de contacto:
 *    → Abre: src/content/contactContent.tsx
 *    → Modifica email, phone, address
 * 
 * 
 * 📚 DOCUMENTACIÓN COMPLETA:
 * =========================
 * Para una guía detallada con ejemplos, consulta:
 * → /GUIA-EDICION-CONTENIDO.md
 * 
 * 
 * 🆘 ¿NECESITAS AYUDA?
 * ===================
 * - Lee la guía: GUIA-EDICION-CONTENIDO.md
 * - Contacta: spaceteam@uma.es
 * 
 */

// ========================================
// EXPORTACIONES (No modificar)
// ========================================

export { heroContent } from './heroContent';
export { missionContent } from './missionContent';
export { teamContent } from './teamContent';
export { teamMembers, getActiveMembers, getMembersBySubsystem } from './teamMembers';
export { subsystemsContent } from './subsystemsContent';
export { timelineContent } from './timelineContent';
export { sponsorsContent } from './sponsorsContent';
export { navigationContent } from './navigationContent';
export { footerContent } from './footerContent';

// Nota: contactContent.tsx se importa directamente en los componentes
// debido a que contiene JSX

/**
 * ESTRUCTURA DE ARCHIVOS DE CONTENIDO:
 * ====================================
 * 
 * src/content/
 * ├── index.ts ........................ Este archivo (índice central)
 * ├── heroContent.ts
 * ├── missionContent.ts
 * ├── teamContent.ts
 * ├── teamMembers.ts .................. ⭐ Nuevo archivo para participantes
 * ├── teamTreeModalContent.ts
 * ├── joinTeamModalContent.ts
 * ├── subsystemsContent.ts
 * ├── subsystemModalContent.ts
 * ├── statsContent.ts
 * ├── timelineContent.ts
 * ├── sponsorsContent.ts
 * ├── contactContent.tsx
 * ├── navigationContent.ts
 * └── footerContent.ts
 */
