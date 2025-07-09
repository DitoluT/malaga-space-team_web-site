import { Box, Zap, Navigation as Nav, Database, Radio, Satellite } from 'lucide-react';

export const subsystemsContent = {
  title: "Subsistemas CubeSat 2U",
  description: "Seis subsistemas integrados con payload reconfigurable para máxima flexibilidad y fiabilidad en órbita.",
  subsystems: [
    {
      icon: Box,
      title: "Estructura",
      description: "Diseño mecánico, selección de materiales y análisis estructural de cara a asegurar que el CubeSat pueda soportar las condiciones de lanzamiento y espacio, y una integración óptima del resto de subsistemas dentro de la estructura.",
      details: {
        components: ["Chasis de aluminio 6061-T6", "Paneles desplegables", "Mecanismos de liberación", "Conectores internos"],
        specifications: ["Dimensiones: 10×10×22.7 cm", "Masa: <2.66 kg", "Resistencia: 25G vibración", "Temperatura: -40°C a +85°C"],
        status: "Diseño CAD completado, análisis FEM en progreso. Prototipo estructural en fabricación.",
        challenges: ["Optimización peso vs resistencia", "Compatibilidad con estándar CubeSat", "Integración de subsistemas"]
      }
    },
    {
      icon: Zap,
      title: "Energía",
      description: "Sistemas eléctricos de generación, almacenamiento y distribución de la energía, capaz de asegurar un suministro de energía óptimo a todos los subsistemas durante la misión en distintas condiciones que se puedan presentar.",
      details: {
        components: ["Paneles solares GaAs", "Baterías Li-ion", "Reguladores de voltaje", "Sistema de distribución"],
        specifications: ["Generación: 8-12W (paneles)", "Almacenamiento: 40Wh (baterías)", "Voltajes: 3.3V, 5V, 12V", "Eficiencia: >85%"],
        status: "Selección de componentes finalizada, pruebas de integración en laboratorio.",
        challenges: ["Gestión térmica de baterías", "Optimización energética", "Redundancia del sistema"]
      }
    },
    {
      icon: Nav,
      title: "ADCS",
      description: "Sistema de Determinación y Control de Actitud para la orientación y estabilidad del satélite en el lanzamiento y en órbita.",
      details: {
        components: ["Magnetómetros", "Giroscopios", "Sensores solares", "Magnetorqueadores", "Ruedas de reacción"],
        specifications: ["Precisión: ±1°", "Velocidad angular: <0.1°/s", "Tiempo de respuesta: <10s", "Consumo: <2W"],
        status: "Algoritmos de control desarrollados, calibración de sensores en progreso.",
        challenges: ["Calibración en órbita", "Interferencias magnéticas", "Algoritmos de control autónomo"]
      }
    },
    {
      icon: Database,
      title: "CDHS",
      description: "Sistema de Comando y Manejo de Datos que procesa mediante software comandos, gestiona el flujo de datos y controla las operaciones del satélite.",
      details: {
        components: ["Procesador ARM Cortex-M7", "Memoria flash 1GB", "RAM 512MB", "Interfaces de comunicación"],
        specifications: ["Frecuencia: 400MHz", "Consumo: <1.5W", "Redundancia: Dual processor", "SO: FreeRTOS"],
        status: "Hardware seleccionado, desarrollo de software de vuelo al 60%.",
        challenges: ["Tolerancia a radiación", "Gestión de memoria", "Protocolos de comunicación"]
      }
    },
    {
      icon: Satellite,
      title: "Carga Útil",
      description: "Instrumentos científicos y equipos experimentales dedicados a asegurar el correcto cumplimiento del objetivo del satélite, pudiendo monitorizar mediante sensores a tiempo real los distintos parámetros relevantes.",
      details: {
        components: ["Cámara multiespectral", "Sensores ambientales", "Experimento de materiales", "Sistema reconfigurable"],
        specifications: ["Resolución: 5m/pixel", "Bandas espectrales: 4", "Datos: 100MB/día", "Reconfiguración: Remota"],
        status: "Diseño conceptual aprobado, selección de sensores en curso.",
        challenges: ["Miniaturización", "Calibración remota", "Procesamiento de datos a bordo"]
      }
    },
    {
      icon: Radio,
      title: "Comunicaciones",
      description: "Sistemas de telecomunicaciones para transmisión de datos entre el satélite y estaciones terrestres en la Tierra.",
      details: {
        components: ["Transceptor UHF/VHF", "Antenas desplegables", "Amplificadores", "Modem digital"],
        specifications: ["Frecuencia: 435-438 MHz", "Potencia: 2W", "Velocidad: 9600 bps", "Alcance: 2000 km"],
        status: "Pruebas de enlace de comunicación completadas, integración con sistema de control.",
        challenges: ["Efecto Doppler", "Ventanas de comunicación", "Protocolos de error"]
      }
    }
  ]
};