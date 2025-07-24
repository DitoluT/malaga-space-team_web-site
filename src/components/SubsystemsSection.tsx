import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Zap, Navigation as Nav, Database, Radio, Satellite } from 'lucide-react';
import { GlassContainer } from './GlassContainer';
import { GlassButton } from './GlassButton';
import { SubsystemModal } from './SubsystemModal';

export const SubsystemsSection: React.FC = () => {
  const { t } = useTranslation();
  const [selectedSubsystem, setSelectedSubsystem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const subsystemKeys = ['structure', 'power', 'adcs', 'cdhs', 'payload', 'communications'];
  const subsystemIcons = [Box, Zap, Nav, Database, Satellite, Radio];

  const openModal = (subsystemKey: string) => {
    const subsystemData = {
      key: subsystemKey,
      title: t(`subsystems.items.${subsystemKey}.title`),
      description: t(`subsystems.items.${subsystemKey}.description`),
      details: {
        components: t(`subsystems.items.${subsystemKey}.components`, { returnObjects: true }) as string[],
        specifications: t(`subsystems.items.${subsystemKey}.specifications`, { returnObjects: true }) as string[],
        status: t(`subsystems.items.${subsystemKey}.status`),
        challenges: t(`subsystems.items.${subsystemKey}.challenges`, { returnObjects: true }) as string[]
      }
    };
    setSelectedSubsystem(subsystemData);
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
              <h2 className="text-5xl font-bold text-white mb-8">{t('subsystems.title')}</h2>
              <p className="text-xl text-white/80">
                {t('subsystems.description')}
              </p>
            </div>
          </GlassContainer>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {subsystemKeys.map((subsystemKey, index) => {
              const IconComponent = subsystemIcons[index];
              
              return (
                <GlassContainer key={index} className="subsystem-glass">
                  <div className="p-4 md:p-6 text-center h-full flex flex-col min-h-[260px] md:min-h-[300px]">
                    <div className="mb-6">
                      <div className="mx-auto w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
                        <IconComponent className="w-8 h-8 text-white/90" />
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">
                      {t(`subsystems.items.${subsystemKey}.title`)}
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed mb-3 md:mb-4 flex-1 line-clamp-4">
                      {t(`subsystems.items.${subsystemKey}.description`)}
                    </p>
                    <div className="mt-auto">
                      <GlassButton 
                        variant="primary" 
                        size="sm" 
                        onClick={() => openModal(subsystemKey)}
                      >
                        {t('subsystems.viewDetails')}
                      </GlassButton>
                    </div>
                  </div>
                </GlassContainer>
              );
            })}
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