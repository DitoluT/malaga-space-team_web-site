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
          <div className="p-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Nuestra Misión</h2>
            <p className="text-lg text-white/80 max-w-4xl mx-auto leading-relaxed">
              El Proyecto CubeSat de la Universidad de Málaga tiene como objetivo diseñar, 
              construir y lanzar un CubeSat totalmente funcional para avanzar en la investigación, 
              educación e innovación en tecnología espacial.
            </p>
          </div>
        </GlassContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {missions.map((mission, index) => (
            <GlassContainer key={index} className="mission-glass">
              <div className="p-4 md:p-6 h-full min-h-[180px] md:min-h-[200px] flex flex-col">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <mission.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{mission.title}</h3>
                    <p className="text-sm text-white/80 leading-relaxed">{mission.description}</p>
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