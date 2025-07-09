import React from 'react';
import { Users, Cpu, Calendar, TrendingUp } from 'lucide-react';
import { GlassContainer } from './GlassContainer';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: Users,
      number: "25+",
      label: "Miembros del Equipo",
      description: "Estudiantes e investigadores"
    },
    {
      icon: Cpu,
      number: "6",
      label: "Subsistemas CubeSat",
      description: "Sistemas integrados"
    },
    {
      icon: Calendar,
      number: "2º Año",
      label: "Proyecto en Desarrollo",
      description: "Progreso continuo"
    },
    {
      icon: TrendingUp,
      number: "6",
      label: "Departamentos",
      description: "Colaboración interdisciplinar"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <GlassContainer key={index} className="stats-glass">
              <div className="p-6 text-center h-full flex flex-col justify-center">
                <div className="mb-6">
                  <div className="mx-auto w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
                    <stat.icon className="w-8 h-8 text-white/90" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-white/90 mb-2">{stat.label}</div>
                <div className="text-sm text-white/70">{stat.description}</div>
              </div>
            </GlassContainer>
          ))}
        </div>
      </div>
    </section>
  );
};