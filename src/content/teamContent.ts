import { Users, GraduationCap, Clock, Cpu } from 'lucide-react';
import { getTotalActiveMembers, getUniqueDepartments, getUniqueSubsystems } from './teamMembers';

/**
 * ====================================
 * 👥 CONFIGURACIÓN DEL EQUIPO
 * ====================================
 * 
 * NOTA: Para añadir o editar miembros del equipo, ve a:
 * src/content/teamMembers.ts
 * 
 * Este archivo contiene solo el texto general y configuración
 * de la sección de equipo.
 */

export const teamContent = {
  title: "Conoce al Equipo",
  description: "Un equipo multidisciplinario de más de 25 estudiantes e investigadores apasionados por la tecnología espacial y la innovación.",
  
  // Las estadísticas se calculan automáticamente desde teamMembers.ts
  teamStats: [
    {
      icon: Users,
      number: `${getTotalActiveMembers()}+`,
      label: "Miembros Activos"
    },
    {
      icon: GraduationCap,
      number: `${getUniqueDepartments().length}`,
      label: "Departamentos"
    },
    {
      icon: Clock,
      number: "2+",
      label: "Años de Experiencia"
    },
    {
      icon: Cpu,
      number: `${getUniqueSubsystems().length}`,
      label: "Subsistemas"
    }
  ],
  joinTeam: {
    title: "Únete al Equipo",
    subtitle: "Un Proyecto Colaborativo e Innovador",
    description: "Nuestro equipo reúne estudiantes e investigadores de múltiples disciplinas: ingeniería aeroespacial, telecomunicaciones, informática, física y más. Trabajamos juntos para desarrollar un CubeSat 2U completamente funcional.",
    callToAction: "🚀 ¿Listo para la Aventura Espacial?",
    callToActionDescription: "Únete a nosotros y sé parte de la próxima generación de innovadores espaciales. Buscamos estudiantes motivados de todas las disciplinas así como colaboraciones externas.",
    buttons: {
      primary: "Ver Equipo Completo",
      secondary: "Únete o Colabora"
    }
  },
  benefits: [
    {
      title: "Experiencia Práctica",
      description: "Aplicación directa de conocimientos teóricos en un proyecto real"
    },
    {
      title: "Colaboración Interdisciplinar",
      description: "Trabajo en equipo entre diferentes áreas de conocimiento"
    },
    {
      title: "Innovación Tecnológica",
      description: "Desarrollo de tecnologías avanzadas para aplicaciones espaciales"
    }
  ],
  disciplines: [
    "Ingeniería", "Informática", "Física", "Matemáticas", "Gestión", "Electrónica", "Mecánica", "Diseño Industrial"
  ]
};