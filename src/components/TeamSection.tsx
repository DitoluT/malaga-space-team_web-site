import React from 'react';
import { Users, GraduationCap, Clock, Cpu } from 'lucide-react';
import { GlassContainer } from './GlassContainer';
import { GlassButton } from './GlassButton';
import { JoinTeamModal } from './JoinTeamModal';
import { TeamTreeModal } from './TeamTreeModal';

export const TeamSection: React.FC = () => {
  const [isJoinModalOpen, setIsJoinModalOpen] = React.useState(false);
  const [isTreeModalOpen, setIsTreeModalOpen] = React.useState(false);

  const teamStats = [
    {
      icon: Users,
      number: "25+",
      label: "Miembros Activos"
    },
    {
      icon: GraduationCap,
      number: "6",
      label: "Departamentos"
    },
    {
      icon: Clock,
      number: "2+",
      label: "Años de Experiencia"
    },
    {
      icon: Cpu,
      number: "6",
      label: "Subsistemas"
    }
  ];

  const benefits = [
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
  ];

  const disciplines = [
    "Ingeniería", "Informática", "Física", "Matemáticas", "Gestión"
  ];

  return (
    <>
      <section id="equipo" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <GlassContainer className="section-glass mb-16">
          <div className="p-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Conoce al Equipo</h2>
            <p className="text-lg text-white/80 max-w-4xl mx-auto">
              Un equipo multidisciplinario de más de 25 estudiantes e investigadores 
              apasionados por la tecnología espacial y la innovación.
            </p>
          </div>
        </GlassContainer>

        {/* Team Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {teamStats.map((stat, index) => (
            <GlassContainer key={index} className="team-stat-glass">
              <div className="p-4 text-center h-full flex flex-col justify-center">
                <div className="mb-4">
                  <div className="mx-auto w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
                    <stat.icon className="w-6 h-6 text-white/90" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            </GlassContainer>
          ))}
        </div>

        {/* Join Team Section */}
        <GlassContainer className="join-team-glass mb-16">
          <div className="p-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">Únete al Equipo</h3>
              <h4 className="text-xl font-semibold text-blue-300 mb-4">Un Proyecto Colaborativo e Innovador</h4>
              <p className="text-base text-white/80 max-w-4xl mx-auto leading-relaxed">
                Nuestro equipo reúne estudiantes e investigadores de múltiples disciplinas: 
                ingeniería aeroespacial, telecomunicaciones, informática, física y más. 
                Trabajamos juntos para desarrollar un CubeSat 2U completamente funcional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <h4 className="text-lg font-bold text-white mb-2">{benefit.title}</h4>
                  <p className="text-sm text-white/80">{benefit.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="mb-8">
                <h4 className="text-xl font-bold text-white mb-3">🚀 ¿Listo para la Aventura Espacial?</h4>
                <p className="text-base text-white/80 mb-4">
                  Únete a nosotros y sé parte de la próxima generación de innovadores espaciales. 
                  Buscamos estudiantes motivados de todas las disciplinas así como colaboraciones externas.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {disciplines.map((discipline, index) => (
                  <span key={index} className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold">
                    {discipline}
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <GlassButton variant="primary" size="lg" onClick={() => setIsTreeModalOpen(true)}>
                  Ver Equipo Completo
                </GlassButton>
                
                <GlassButton variant="secondary" size="lg" onClick={() => setIsJoinModalOpen(true)}>
                  Únete o Colabora
                </GlassButton>
              </div>
            </div>
          </div>
        </GlassContainer>
      </div>
      </section>
      
      <JoinTeamModal 
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
      
      <TeamTreeModal 
        isOpen={isTreeModalOpen}
        onClose={() => setIsTreeModalOpen(false)}
      />
    </>
  );
};