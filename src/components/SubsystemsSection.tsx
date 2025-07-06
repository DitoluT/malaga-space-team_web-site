import React, { useState } from 'react';
import { Box, Zap, Navigation as Nav, Database, Radio, Satellite } from 'lucide-react';
import { GlassContainer } from './GlassContainer';
import { GlassButton } from './GlassButton';
import { SubsystemModal } from './SubsystemModal';

export const SubsystemsSection: React.FC = () => {
  const [selectedSubsystem, setSelectedSubsystem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const subsystems = [
    {
      icon: Box,
      title: "Estructura",
      description: "Diseño mecánico, selección de materiales y análisis estructural para asegurar que el CubeSat pueda soportar las condiciones de lanzamiento y espacio.",
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
      description: "Sistemas de generación, almacenamiento y distribución de energía para proporcionar electricidad a todos los subsistemas durante la misión.",
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
      description: "Sistema de Determinación y Control de Actitud para la orientación y estabilidad del satélite en órbita.",
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
      description: "Sistema de Comando y Manejo de Datos que procesa comandos, gestiona el flujo de datos y controla las operaciones del satélite.",
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
      description: "Instrumentos científicos y equipos experimentales diseñados para cumplir los objetivos de misión del CubeSat.",
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
  ];

  const openModal = (subsystem: any) => {
    setSelectedSubsystem(subsystem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedSubsystem(null);
    }, 300); // Delay para permitir que termine la animación de cierre
  };

  return (
    <>
      <section id="subsistemas" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <GlassContainer className="section-glass mb-16">
            <div className="p-12 text-center">
              <h2 className="text-5xl font-bold text-white mb-8">Subsistemas CubeSat 2U</h2>
              <p className="text-xl text-white/80">
                Seis subsistemas integrados con payload reconfigurable para máxima flexibilidad en órbita
              </p>
            </div>
          </GlassContainer>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {subsystems.map((subsystem, index) => (
              <GlassContainer key={index} className="subsystem-glass">
                <div className="p-4 md:p-6 text-center h-full flex flex-col min-h-[260px] md:min-h-[300px]">
                  <div className="mb-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <subsystem.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{subsystem.title}</h3>
                  <p className="text-sm text-white/80 leading-relaxed mb-3 md:mb-4 flex-1 line-clamp-4">{subsystem.description}</p>
                  <div className="mt-auto">
                    <GlassButton 
                      variant="primary" 
                      size="sm" 
                      onClick={() => openModal(subsystem)}
                    >
                      Ver Detalles →
                    </GlassButton>
                  </div>
                </div>
              </GlassContainer>
            ))}
          </div>
        </div>
      </section>
      
      <SubsystemModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        subsystem={selectedSubsystem}
      />
    </>
  );
};