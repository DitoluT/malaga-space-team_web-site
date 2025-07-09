export const joinTeamModalContent = {
  title: "Únete o Colabora",
  description: "Forma parte del Proyecto CubeSat de la Universidad de Málaga o colabora con nosotros",
  form: {
    personalInfo: {
      title: "Información Personal",
      name: "Nombre Completo *",
      namePlaceholder: "Ej: Juan Pérez García",
      email: "Correo Electrónico *",
      emailPlaceholder: "juan.perez@uma.es",
    linkedin: "LinkedIn (Opcional)",
    linkedinPlaceholder: "Tu perfil de LinkedIn"
    },
    contactReason: {
      title: "Motivo del Contacto",
      label: "¿Por qué quieres contactar con nosotros? *",
      placeholder: "Selecciona el motivo de contacto",
      reasons: [
        'Unirse al equipo',
        'Colaboración académica',
        'Patrocinio',
        'Información general'
      ]
    },
    academicInfo: {
      title: "Información Académica",
      degree: "Grado/Carrera que estudias *",
      degreePlaceholder: "Ej: Ingeniería de Telecomunicación",
      year: "Curso actual *",
      yearPlaceholder: "Selecciona tu curso",
      years: [
        '1º Grado',
        '2º Grado', 
        '3º Grado',
        '4º Grado',
        '1º Máster',
        '2º Máster',
        'Doctorado',
        'Egresado'
      ]
    },
    interests: {
      title: "Área de Interés",
      label: "¿En qué áreas del proyecto te gustaría trabajar? * (puedes seleccionar varias)",
      showInfo: "ℹ️ Ver información sobre los subsistemas",
      hideInfo: "ℹ️ Ocultar información sobre los subsistemas",
      subsystems: [
        { name: 'Estructura', description: 'Diseño mecánico y materiales' },
        { name: 'Energía', description: 'Paneles solares y baterías' },
        { name: 'ADCS (Control de Actitud)', description: 'Control de orientación y estabilidad' },
        { name: 'CDHS (Comando y Manejo de Datos)', description: 'Procesamiento y almacenamiento de datos' },
        { name: 'Payload / Carga Útil', description: 'Instrumentos científicos' },
        { name: 'Comunicaciones', description: 'Enlace con estaciones terrestres' },
        { name: 'Gestión de Proyectos', description: 'Coordinación y administración' },
        { name: 'Otro', description: 'Especificar en el mensaje' }
      ]
    },
    message: {
      title: "Mensaje",
      labelJoin: "Cuéntanos sobre tu motivación para unirte al equipo *",
      labelDefault: "Cuéntanos más sobre tu consulta *",
      placeholderJoin: "Describe tu experiencia, motivación y cómo te gustaría contribuir al proyecto CubeSat...",
      placeholderDefault: "Describe tu consulta...",
      minLength: 50,
      maxLength: 500,
      counterText: "Mínimo 50 caracteres"
    },
    importantInfo: {
      title: "📋 Información Importante",
      joinItems: [
        "El proyecto está abierto a estudiantes de todas las disciplinas",
        "Se requiere compromiso y dedicación para el desarrollo del CubeSat 2U",
        "Oportunidad de aprendizaje práctico en tecnología espacial"
      ],
      defaultItems: [
        "Contactaremos contigo en un plazo de 3-5 días laborables"
      ]
    },
    submitButton: "Enviar Solicitud"
  }
};