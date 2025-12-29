import React, { useState } from 'react';
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
  image_url: string;
}

const DEPARTMENTS_CONFIG = [
    { id: 'structure_energy', label: 'Estructura y Energía' },
    { id: 'comms', label: 'Comunicaciones' },
    { id: 'ground_station', label: 'Estación Terrena' },
    { id: 'control_software', label: 'Sistemas de Control y Software' },
    { id: 'marketing', label: 'Marketing' },
];

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

  const professors = members.filter(m => m.department === 'professors');
  const management = members.filter(m => m.department === 'management');

  const MemberCard: React.FC<{ member: TeamMember; variant?: 'large' | 'medium' | 'small' }> = ({
    member, 
    variant = 'small'
  }) => {
    const sizeClasses = {
        large: 'w-64 min-h-[320px]',
        medium: 'w-56 min-h-[280px]',
        small: 'w-48 min-h-[240px]'
    };

    return (
      <GlassContainer className="mission-glass">
        <div className={`p-4 text-center h-full flex flex-col justify-between ${sizeClasses[variant]}`}>
          <div className="flex flex-col items-center mb-3">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 mb-3 bg-white/10 shadow-lg">
                {member.image_url ? (
                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center"><Users className="w-8 h-8 text-white/50" /></div>
                )}
            </div>
            
            <h4 className="font-bold text-white leading-tight mb-1 text-sm md:text-base">
              {member.name}
            </h4>
          </div>
          
          <div className="space-y-2 flex-1 flex flex-col justify-start">
            <div className="flex items-center justify-center space-x-1.5">
              <Briefcase className="w-3 h-3 text-blue-400 flex-shrink-0" />
              <p className="text-blue-300 font-medium leading-tight text-xs">
                {member.role}
              </p>
            </div>
            
            {member.title && (
              <div className="flex items-center justify-center space-x-1.5">
                <GraduationCap className="w-3 h-3 text-green-400 flex-shrink-0" />
                <p className="text-white/70 leading-tight text-[10px]">
                  {member.title}
                </p>
              </div>
            )}
          </div>
        </div>
      </GlassContainer>
    );
  };

  const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-300 mb-10 text-center drop-shadow-sm">
      {children}
    </h3>
  );

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-2" data-modal>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
      
      <GlassContainer className={`modal-glass w-full max-w-7xl max-h-[95vh] mx-2 overflow-hidden ${isClosing ? 'modal-exit' : ''}`}>
        <div className="modal-content-wrapper p-6 lg:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 p-2 border-b border-white/10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-2">
                {t('team.treeModal.title')}
              </h2>
              <p className="text-white/60 text-lg">
                Organigrama del Equipo
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
          <div className="space-y-16 pb-12">

            {/* Profesores */}
            {professors.length > 0 && (
                <div className="text-center">
                    <SectionTitle>Profesores</SectionTitle>
                    <div className="flex flex-wrap justify-center gap-6">
                        {professors.map(m => <MemberCard key={m.id} member={m} variant="large" />)}
                    </div>
                </div>
            )}

            {/* Management */}
            {management.length > 0 && (
                <div className="text-center">
                    <SectionTitle>Management</SectionTitle>
                    <div className="flex flex-wrap justify-center gap-6">
                        {management.map(m => <MemberCard key={m.id} member={m} variant="medium" />)}
                    </div>
                </div>
            )}

            {/* Departamentos Técnicos */}
            <div className="space-y-12">
                {DEPARTMENTS_CONFIG.map(dept => {
                    const deptMembers = members.filter(m => m.department === dept.id);
                    if (deptMembers.length === 0) return null;

                    const leaders = deptMembers.filter(m => m.category === 'leader');
                    const regularMembers = deptMembers.filter(m => m.category === 'member' || m.category === 'director' || m.category === 'coordinator'); // Fallback if category misused
                    // Wait, director/coordinator shouldn't be here if filtering by dept.
                    // But if someone sets dept=comms and category=coordinator?
                    // I'll stick to leader vs others.
                    const others = deptMembers.filter(m => m.category !== 'leader');

                    return (
                        <div key={dept.id} className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h4 className="text-2xl font-bold text-white mb-8 text-center">{dept.label}</h4>

                            {/* Leaders Row */}
                            {leaders.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-6 mb-8 border-b border-white/5 pb-8">
                                    {leaders.map(m => <MemberCard key={m.id} member={m} variant="medium" />)}
                                </div>
                            )}

                            {/* Members Grid */}
                            {others.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-4">
                                    {others.map(m => <MemberCard key={m.id} member={m} variant="small" />)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

          </div>
          )}
        </div>
      </GlassContainer>
    </div>
  );
};
