import React, { useState } from 'react';
import { X, Users, GraduationCap, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GlassContainer } from './GlassContainer';
import { GlassButton } from './GlassButton';
import { useNavigation } from './Navigation';
import { teamTreeModalContent } from '../content/teamTreeModalContent';

interface TeamTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TeamMember {
  name: string;
  role: string;
  department: string;
  title: string;
}

export const TeamTreeModal: React.FC<TeamTreeModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { hideNavigation, showNavigation } = useNavigation();
  const [isClosing, setIsClosing] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      hideNavigation();
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
    } else {
      showNavigation();
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, hideNavigation, showNavigation]);

  const { directors, coordinators, subsystemLeaders, developmentTeam, departmentNames } = teamTreeModalContent;

  // Obtener los nombres de los líderes para filtrarlos del equipo de desarrollo
  const leaderNames = new Set(subsystemLeaders.map(leader => leader.name));

  // Filtrar el equipo de desarrollo para evitar duplicados con los líderes
  const filteredDevelopmentTeam = developmentTeam.filter(member => !leaderNames.has(member.name));

  // Agrupar el equipo de desarrollo filtrado por departamento
  const developmentTeamBySubsystem = filteredDevelopmentTeam.reduce((acc, member) => {
    const { department } = member;
    if (!acc[department]) {
      acc[department] = [];
    }
    acc[department].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  const MemberCard: React.FC<{ member: TeamMember; variant?: 'director' | 'coordinator' | 'leader' | 'member' }> = ({ 
    member, 
    variant = 'member' 
  }) => {
    // Todas las cards tienen el mismo tamaño, un poco más anchas
    const cardSize = 'w-[200px] min-h-[280px]';

    return (
      <GlassContainer className="mission-glass">
        <div className={`p-4 text-center h-full flex flex-col justify-between ${cardSize}`}>
          {/* Avatar */}
          <div className="flex flex-col items-center mb-3">
            <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg mb-3">
              <Users className="w-7 h-7 text-white/90" />
            </div>
            
            {/* Nombre */}
            <h4 className="font-bold text-white leading-tight mb-2 text-sm">
              {member.name}
            </h4>
          </div>
          
          {/* Información */}
          <div className="space-y-2 flex-1">
            {/* Rol */}
            <div className="flex items-start justify-center space-x-2">
              <Briefcase className="w-3 h-3 text-blue-400 mt-1 flex-shrink-0" />
              <p className="text-blue-300 font-medium leading-tight text-xs">
                {member.role}
              </p>
            </div>
            
            {/* Departamento */}
            {member.department && (
              <div className="bg-white/5 rounded-md px-2 py-1">
                <p className="text-white/80 font-medium text-xs">
                  {t(`team.treeModal.departments.${member.department}`) || member.department}
                </p>
              </div>
            )}
            
            {/* Título académico */}
            {member.title && (
              <div className="flex items-start justify-center space-x-2">
                <GraduationCap className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-white/70 leading-tight text-xs">
                  {member.title}
                </p>
              </div>
            )}
          </div>
        </div>
      </GlassContainer>
    );
  };

  const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <h3 className={`text-xl md:text-2xl font-bold text-white mb-6 text-center drop-shadow-lg ${className}`}>
      {children}
    </h3>
  );

  const ConnectionLine: React.FC<{ orientation?: 'vertical' | 'horizontal'; length?: 'short' | 'medium' | 'long' }> = ({ 
    orientation = 'vertical', 
    length = 'short' 
  }) => {
    const lengths = {
      short: orientation === 'vertical' ? 'h-6' : 'w-32',
      medium: orientation === 'vertical' ? 'h-8' : 'w-48',
      long: orientation === 'vertical' ? 'h-12' : 'w-64'
    };
    
    return (
      <div className="flex justify-center my-4">
        <div className={`${orientation === 'vertical' ? 'w-px' : 'h-px'} ${lengths[length]} bg-white/20`}></div>
      </div>
    );
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-2" data-modal>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}></div>
      
      <GlassContainer className={`modal-glass w-full max-w-7xl max-h-[95vh] mx-2 overflow-hidden ${isClosing ? 'modal-exit' : ''}`}>
        <div className="modal-content-wrapper p-6 lg:p-8 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-2">
                {t('team.treeModal.title')}
              </h2>
              <p className="text-white/80 drop-shadow text-base">
                {t('team.treeModal.description')}
              </p>
            </div>
            <button 
              onClick={handleClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20 backdrop-blur-sm"
            >
              <X className="w-5 h-5 text-white/90" />
            </button>
          </div>
          
          <div className="space-y-12">
            {/* Dirección del Proyecto */}
            <div>
              <SectionTitle>{t('team.treeModal.sections.directors')}</SectionTitle>
              <div className="flex flex-wrap justify-center gap-6">
                {directors.map((director, index) => (
                  <MemberCard key={index} member={director} variant="director" />
                ))}
              </div>
              <ConnectionLine />
            </div>

            {/* Coordinadores del Proyecto */}
            <div>
              <SectionTitle>{t('team.treeModal.sections.coordinators')}</SectionTitle>
              <div className="flex flex-wrap justify-center gap-6">
                {coordinators.map((coordinator, index) => (
                  <MemberCard key={index} member={coordinator} variant="coordinator" />
                ))}
              </div>
              <ConnectionLine />
            </div>

            {/* Líderes de Subsistema */}
            <div>
              <SectionTitle>{t('team.treeModal.sections.subsystemLeaders')}</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 justify-items-center">
                {subsystemLeaders.map((leader, index) => (
                  <MemberCard key={index} member={leader} variant="leader" />
                ))}
              </div>
              <ConnectionLine />
            </div>

            {/* Equipo de Ingenieros por Subsistema */}
            <div>
              <SectionTitle>{t('team.treeModal.sections.developmentTeam')}</SectionTitle>
              <div className="space-y-8">
                {Object.entries(developmentTeamBySubsystem).map(([subsystem, members]) => (
                  <div key={subsystem}>
                    <h4 className="text-lg font-bold text-white mb-4 text-center">
                      {t(`team.treeModal.departments.${subsystem}`) || subsystem}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-items-center">
                      {members.map((member, index) => (
                        <MemberCard key={index} member={member} variant="member" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer con estadísticas */}
          <div className="mt-12 text-center">
            <GlassContainer className="stats-glass">
              <div className="p-6">
                <h4 className="text-white font-semibold mb-4 text-lg">
                  {t('team.treeModal.stats.title')}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-300">{directors.length + coordinators.length + subsystemLeaders.length + filteredDevelopmentTeam.length}</div>
                    <div className="text-white/80 text-sm">{t('team.treeModal.stats.members')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-300">5</div>
                    <div className="text-white/80 text-sm">{t('team.treeModal.stats.departments')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-300">8</div>
                    <div className="text-white/80 text-sm">{t('team.treeModal.stats.disciplines')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-300">2+</div>
                    <div className="text-white/80 text-sm">{t('team.treeModal.stats.years')}</div>
                  </div>
                </div>
              </div>
            </GlassContainer>
            
            <div className="mt-6">
              <GlassButton onClick={handleClose} variant="primary" size="md">
                {t('team.treeModal.closeButton')}
              </GlassButton>
            </div>
          </div>
        </div>
      </GlassContainer>
    </div>
  );
};