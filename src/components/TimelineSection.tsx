import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { GlassContainer } from './GlassContainer';

export const TimelineSection: React.FC = () => {
  const { t } = useTranslation();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visiblePhases, setVisiblePhases] = useState<Set<number>>(new Set());
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      // Calcular progreso de la línea principal
      if (elementTop <= windowHeight * 0.8 && rect.bottom >= windowHeight * 0.2) {
        const scrolled = windowHeight * 0.8 - elementTop;
        const maxScroll = elementHeight + windowHeight * 0.6;
        const progress = Math.min(100, Math.max(0, (scrolled / maxScroll) * 100));
        setScrollProgress(progress);
      }

      // Calcular visibilidad de cada fase
      const newVisiblePhases = new Set(visiblePhases);
      const phaseElements = timelineRef.current.querySelectorAll('[data-phase]');
      
      phaseElements.forEach((element, index) => {
        const phaseRect = element.getBoundingClientRect();
        if (phaseRect.top <= windowHeight * 0.8) {
          newVisiblePhases.add(index);
        }
      });
      
      setVisiblePhases(newVisiblePhases);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [visiblePhases]);

  const phaseKeys = ['phase1', 'phase2', 'phase3', 'phase4', 'phase5', 'phase6'];

  const getStatusTranslation = (phaseKey: string) => {
    const status = t(`timeline.${phaseKey}.status`);
    if (status.includes('Completado')) return 'completed';
    if (status.includes('Progreso') || status.includes('Progress')) return 'in-progress';
    return 'upcoming';
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return t('timeline.statusLabels.completed', 'Completado');
      case 'in-progress': return t('timeline.statusLabels.inProgress', 'En Progreso');
      default: return t('timeline.statusLabels.upcoming', 'Próximo');
    }
  };

  return (
    <section id="cronograma" className="py-20 px-4" ref={timelineRef}>
      <div className="max-w-7xl mx-auto">
        <GlassContainer className="section-glass mb-16">
          <div className="p-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">{t('timeline.title')}</h2>
            <p className="text-lg text-white/80">
              {t('timeline.description')}
            </p>
          </div>
        </GlassContainer>

        <div className="relative">
          {/* Timeline vertical line */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gray-600 z-0">
            {/* Animated progress line */}
            <div 
              className="w-full bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 transition-all duration-500 ease-out relative"
              style={{ height: `${scrollProgress}%` }}
            >
              {/* Glowing effect at the end */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50 animate-pulse"></div>
            </div>
          </div>

          {/* Timeline items */}
          <div className="space-y-16">
            {phaseKeys.map((phaseKey, index) => {
              const isLeft = index % 2 === 0 && window.innerWidth >= 768;
              const isVisible = visiblePhases.has(index);
              const status = getStatusTranslation(phaseKey);

              return (
                <div key={index} className="relative flex items-center" data-phase={index}>
                  {/* Timeline node */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 md:-translate-x-1/2 z-20">
                    <div 
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-700 backdrop-blur-sm border ${
                        isVisible 
                          ? status === 'completed' 
                            ? 'bg-green-500/20 border-green-500/40 shadow-lg shadow-green-500/30 scale-100' 
                            : status === 'in-progress' 
                            ? 'bg-blue-500/20 border-blue-500/40 shadow-lg shadow-blue-500/30 scale-100' 
                            : 'bg-white/10 border-white/20 shadow-lg shadow-white/20 scale-100'
                          : 'bg-gray-700/20 border-gray-700/40 scale-75'
                      } ${isVisible ? 'opacity-100' : 'opacity-50'}`}
                    >
                      {status === 'completed' ? (
                        <CheckCircle className="w-8 h-8 text-white/90" />
                      ) : status === 'in-progress' ? (
                        <Clock className="w-8 h-8 text-white/90" />
                      ) : (
                        <ArrowRight className="w-8 h-8 text-white/90" />
                      )}
                    </div>
                  </div>

                  {/* Content card */}
                  <div className={`w-full md:w-5/12 ${
                    window.innerWidth >= 768 
                      ? (isLeft ? 'mr-auto pr-16' : 'ml-auto pl-16')
                      : 'pl-20'
                  }`}>
                    <div 
                      className={`transform transition-all duration-1000 ${
                        isVisible 
                          ? 'translate-x-0 opacity-100 scale-100' 
                          : (isLeft && window.innerWidth >= 768)
                          ? '-translate-x-12 opacity-0 scale-95' 
                          : 'translate-x-12 opacity-0 scale-95'
                      }`}
                      style={{ transitionDelay: `${index * 150}ms` }}
                    >
                      <GlassContainer className="timeline-glass">
                        <div className="p-8">
                          {/* Year badge */}
                          <div className={`mb-4 ${(isLeft && window.innerWidth >= 768) ? 'text-left' : window.innerWidth >= 768 ? 'text-right' : 'text-left'}`}>
                            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold">
                              {t(`timeline.${phaseKey}.year`)}
                            </span>
                          </div>

                          <div className={`${(isLeft && window.innerWidth >= 768) ? 'text-left' : window.innerWidth >= 768 ? 'text-right' : 'text-left'}`}>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${
                              status === 'completed' ? 'bg-green-500/20 text-green-300' :
                              status === 'in-progress' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-gray-500/20 text-gray-300'
                            }`}>
                              {getStatusText(status)}
                            </span>
                            
                            <h3 className="text-sm font-semibold text-blue-300 mb-2">{t(`timeline.${phaseKey}.phase`)}</h3>
                            <h4 className="text-2xl font-bold text-white mb-4">{t(`timeline.${phaseKey}.title`)}</h4>
                            <p className="text-white/80 mb-4 leading-relaxed">{t(`timeline.${phaseKey}.description`)}</p>
                            
                            {t(`timeline.${phaseKey}.details`, { defaultValue: '' }) && (
                              <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-white/70 text-sm">{t(`timeline.${phaseKey}.details`)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </GlassContainer>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};