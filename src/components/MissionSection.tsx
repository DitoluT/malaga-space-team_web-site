import React from 'react';
import { Satellite, BookOpen, Users, Globe } from 'lucide-react';
import { GlassContainer } from './GlassContainer';

export const MissionSection: React.FC = () => {
  const missions = [
    {
      icon: Satellite,
      title: "Innovación Tecnológica",
      description: "Desarrollando tecnología CubeSat de vanguardia para avanzar en el campo de la ingeniería aeroespacial y comunicaciones satelitales."
    },
    {
      icon: BookOpen,
      title: "Excelencia Educativa",
      description: "Proporcionando oportunidades de aprendizaje práctico para estudiantes de ingeniería, informática y campos relacionados."
    },
    {
      icon: Users,
      title: "Investigación Colaborativa",
      description: "Fomentando la colaboración entre departamentos académicos, socios industriales y agencias espaciales."
    },
    {
      icon: Globe,
      title: "Impacto Global",
      description: "Contribuyendo con datos significativos para abordar el monitoreo ambiental, respuesta a desastres y desafíos de comunicación global."
    }
  ];

  return (
    <section id="acerca" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <GlassContainer className="section-glass mb-16">
          <div className="p-12 text-center">
            <h2 className="text-5xl font-bold text-white mb-8">Nuestra Misión</h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              El Proyecto CubeSat de la Universidad de Málaga tiene como objetivo diseñar, 
              construir y lanzar un CubeSat totalmente funcional para avanzar en la investigación, 
              educación e innovación en tecnología espacial.
            </p>
          </div>
        </GlassContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {missions.map((mission, index) => (
            <GlassContainer key={index} className="mission-glass">
              <div className="p-6 md:p-8 h-full min-h-[280px] md:min-h-[320px]">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <mission.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">{mission.title}</h3>
                    <p className="text-sm md:text-base text-white/80 leading-relaxed">{mission.description}</p>
                  </div>
                </div>
              </div>
            </GlassContainer>
          ))}
        </div>
      </div>
    </section>
  );
};