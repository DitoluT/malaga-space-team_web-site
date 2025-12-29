import React, { useState, useEffect } from 'react';
import { X, Users, GraduationCap, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GlassContainer } from './GlassContainer';
import { GlassButton } from './GlassButton';
import { useNavigation } from './Navigation';
import { API_ENDPOINTS } from '../config/api';

interface TeamTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  title?: string;
  department: string;
  category: string;
}

export const TeamTreeModal: React.FC<TeamTreeModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { hideNavigation, showNavigation } = useNavigation();
  const [isClosing, setIsClosing] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (isOpen) {
      hideNavigation();
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
      fetchMembers();
    } else {
      showNavigation();
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, hideNavigation, showNavigation]);

  const fetchMembers = async () => {
    try {
        const res = await fetch(`${API_ENDPOINTS.webTeam}`);
        const data = await res.json();
        if (data.success) {
            setMembers(data.data);
        }
    } catch (e) {
        console.error("Failed to fetch team", e);
    } finally {
        setLoading(false);
    }
  };

  const directors = members.filter(m => m.category === 'director');
  const coordinators = members.filter(m => m.category === 'coordinator');
  const subsystemLeaders = members.filter(m => m.category === 'leader');
  // Filter members, and also exclude any that might be leaders (if category is mixed, but here we assume strict category)
  // Actually, 'member' category is explicit.
  const developmentTeam = members.filter(m => m.category === 'member');

  // Agrupar el equipo de desarrollo filtrado por departamento
  const developmentTeamBySubsystem = developmentTeam.reduce((acc, member) => {
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
    // Tarjetas con mejor espaciado y tamaño adaptativo
    const cardSize = variant === 'director' || variant === 'coordinator' 
      ? 'w-full max-w-[280px] min-h-[300px]' 
      : 'w-full max-w-[240px] min-h-[280px]';

    return (
      <GlassContainer className="mission-glass">
        <div className={`p-5 text-center h-full flex flex-col justify-between ${cardSize}`}>
          {/* Avatar */}
          <div className="flex flex-col items-center mb-4">
            <div className={`${
              variant === 'director' ? 'w-20 h-20' : 
              variant === 'coordinator' ? 'w-16 h-16' : 
              'w-14 h-14'
            } bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-white/30 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg mb-3`}>
              <Users className={`${
                variant === 'director' ? 'w-10 h-10' : 
                variant === 'coordinator' ? 'w-8 h-8' : 
                'w-7 h-7'
              } text-white`} />
            </div>
            
            {/* Nombre */}
            <h4 className={`font-bold text-white leading-tight mb-2 ${
              variant === 'director' ? 'text-base' : 
              variant === 'coordinator' ? 'text-sm' : 
              'text-sm'
            }`}>
              {member.name}
            </h4>
          </div>
          
          {/* Información */}
          <div className="space-y-2.5 flex-1">
            {/* Rol */}
            <div className="flex items-start justify-center space-x-2">
              <Briefcase className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-blue-300 font-medium leading-tight text-xs">
                {member.role}
              </p>
            </div>
            
            {/* Departamento */}
            {member.department && (
              <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-lg px-3 py-2 border border-white/10">
                <p className="text-white/90 font-semibold text-xs leading-tight">
                  {t(`team.treeModal.departments.${member.department}`) !== `team.treeModal.departments.${member.department}` 
                    ? t(`team.treeModal.departments.${member.department}`)
                    : member.department}
                </p>
              </div>
            )}
            
            {/* Título académico */}
            {member.title && (
              <div className="flex items-start justify-center space-x-2 pt-1">
                <GraduationCap className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
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
          
          {loading ? (
             <div className="text-center text-white p-12">Cargando organigrama...</div>
          ) : (
          <div className="space-y-12">
            {/* Dirección del Proyecto */}
            {directors.length > 0 && (
                <div>
                <SectionTitle>{t('team.treeModal.sections.directors')}</SectionTitle>
                <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
                    {directors.map((director, index) => (
                    <MemberCard key={index} member={director} variant="director" />
                    ))}
                </div>
                <ConnectionLine />
                </div>
            )}

            {/* Coordinadores del Proyecto */}
            {coordinators.length > 0 && (
                <div>
                <SectionTitle>{t('team.treeModal.sections.coordinators')}</SectionTitle>
                <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
                    {coordinators.map((coordinator, index) => (
                    <MemberCard key={index} member={coordinator} variant="coordinator" />
                    ))}
                </div>
                <ConnectionLine />
                </div>
            )}

            {/* Líderes de Subsistema */}
            {subsystemLeaders.length > 0 && (
                <div>
                <SectionTitle>{t('team.treeModal.sections.subsystemLeaders')}</SectionTitle>
                <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
                    {subsystemLeaders.map((leader, index) => (
                    <MemberCard key={index} member={leader} variant="leader" />
                    ))}
                </div>
                <ConnectionLine />
                </div>
            )}

            {/* Equipo de Ingenieros por Subsistema */}
            <div>
              <SectionTitle>{t('team.treeModal.sections.developmentTeam')}</SectionTitle>
              {Object.keys(developmentTeamBySubsystem).length === 0 ? (
                  <div className="text-center text-white/60">No hay miembros en el equipo de desarrollo.</div>
              ) : (
                <div className="space-y-10">
                    {Object.entries(developmentTeamBySubsystem).map(([subsystem, members]) => (
                    <div key={subsystem}>
                        <h4 className="text-lg font-bold text-white mb-6 text-center bg-white/5 border border-white/10 rounded-lg py-3 px-6 inline-block mx-auto">
                        {t(`team.treeModal.departments.${subsystem}`) !== `team.treeModal.departments.${subsystem}`
                            ? t(`team.treeModal.departments.${subsystem}`)
                            : subsystem}
                        </h4>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {members.map((member, index) => (
                            <MemberCard key={index} member={member} variant="member" />
                        ))}
                        </div>
                    </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          )}
          
          {/* Footer con estadísticas */}
          <div className="mt-12 text-center">
            <GlassContainer className="stats-glass">
              <div className="p-6">
                <h4 className="text-white font-semibold mb-4 text-lg">
                  {t('team.treeModal.stats.title')}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-300">{members.length}</div>
                    <div className="text-white/80 text-sm">{t('team.treeModal.stats.members')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-300">{Object.keys(developmentTeamBySubsystem).length}</div>
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
