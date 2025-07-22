import React from 'react';
import { useTranslation } from 'react-i18next';
import { Satellite, BookOpen, Users, Globe } from 'lucide-react';
import { GlassContainer } from './GlassContainer';

export const MissionSection: React.FC = () => {
  const { t } = useTranslation();
  
  const missions = [
    {
      icon: Satellite,
      title: t('mission.technologicalInnovation.title'),
      description: t('mission.technologicalInnovation.description')
    },
    {
      icon: BookOpen,
      title: t('mission.educationalExcellence.title'),
      description: t('mission.educationalExcellence.description')
    },
    {
      icon: Users,
      title: t('mission.collaborativeResearch.title'),
      description: t('mission.collaborativeResearch.description')
    },
    {
      icon: Globe,
      title: t('mission.globalImpact.title'),
      description: t('mission.globalImpact.description')
    }
  ];

  return (
    <section id="acerca" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <GlassContainer className="section-glass mb-16">
          <div className="p-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">{t('mission.title')}</h2>
            <p className="text-lg text-white/80 max-w-4xl mx-auto leading-relaxed">
              {t('mission.description')}
            </p>
          </div>
        </GlassContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {missions.map((mission, index) => (
            <GlassContainer key={index} className="mission-glass">
              <div className="p-4 md:p-6 h-full min-h-[180px] md:min-h-[200px] flex flex-col">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
                      <mission.icon className="w-6 h-6 text-white/90" />
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