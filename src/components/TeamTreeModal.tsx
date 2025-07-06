import React, { useState } from 'react';
import { X, Users } from 'lucide-react';
import { GlassContainer } from './GlassContainer';
import { GlassButton } from './GlassButton';
import { useNavigation } from './Navigation';

interface TeamTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TeamMember {
  name: string;
  role: string;
  department: string;
  image?: string;
}

export const TeamTreeModal: React.FC<TeamTreeModalProps> = ({ isOpen, onClose }) => {
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

  const directors: TeamMember[] = [
    {
      name: "Sergio Fortes",
      role: "Director del Proyecto",
      department: "Ingeniería de Comunicaciones"
    },
    {
      name: "Rafael Godoy (Fali)",
      role: "Co-Director",
      department: "Ingeniería Eléctrica"
    }
  ];

  const coordinators: TeamMember[] = [
    {
      name: "Paco Muro",
      role: "Coordinador del Proyecto",
      department: "Telecomunicaciones"
    },
    {
      name: "Pepe Pulido",
      role: "Coordinador del Proyecto",
      department: "Informática"
    }
  ];

  const subsystemLeaders: TeamMember[] = [
    {
      name: "Ana García",
      role: "Líder de Estructura",
      department: "Ingeniería Aeroespacial"
    },
    {
      name: "Carlos Ruiz",
      role: "Líder de Energía",
      department: "Ingeniería Eléctrica"
    },
    {
      name: "Lucía Martín",
      role: "Líder de ADCS",
      department: "Telecomunicaciones"
    },
    {
      name: "Miguel Sánchez",
      role: "Líder de Payload",
      department: "Telecomunicaciones"
    }
  ];

  const developmentTeam: TeamMember[] = [
    {
      name: "Elena López",
      role: "Desarrolladora",
      department: "Informática"
    },
    {
      name: "David Fernández",
      role: "Especialista Técnico",
      department: "Informática"
    },
    {
      name: "María González",
      role: "Ingeniera",
      department: "Aeroespacial"
    },
    {
      name: "Javier Ruiz",
      role: "Analista",
      department: "Matemáticas"
    },
    {
      name: "Laura Moreno",
      role: "Diseñadora",
      department: "Ingeniería"
    },
    {
      name: "Antonio Silva",
      role: "Investigador",
      department: "Física"
    },
    {
      name: "Carmen Jiménez",
      role: "Especialista",
      department: "Telecomunicaciones"
    },
    {
      name: "Pablo Herrera",
      role: "Desarrollador",
      department: "Informática"
    }
  ];

  const MemberCard: React.FC<{ member: TeamMember; isLarge?: boolean }> = ({ member, isLarge = false }) => (
    <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 sm:p-4 text-center ${isLarge ? 'min-w-[180px] sm:min-w-[200px]' : 'min-w-[140px] sm:min-w-[160px]'}`}>
      <div className={`w-${isLarge ? '16' : '12'} h-${isLarge ? '16' : '12'} mx-auto mb-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center`}>
        <Users className={`w-${isLarge ? '8' : '6'} h-${isLarge ? '8' : '6'} text-white`} />
      </div>
      <h4 className={`font-bold text-white mb-1 ${isLarge ? 'text-lg' : 'text-sm'}`}>{member.name}</h4>
      <p className={`text-blue-300 font-semibold mb-1 ${isLarge ? 'text-xs sm:text-sm' : 'text-xs'}`}>{member.role}</p>
      <p className={`text-white/70 ${isLarge ? 'text-xs' : 'text-xs'}`}>{member.department}</p>
    </div>
  );

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-1 sm:p-2 md:p-4" data-modal>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}></div>
      
      <GlassContainer className={`modal-glass w-full max-w-7xl max-h-[95vh] sm:max-h-[90vh] mx-1 sm:mx-2 md:mx-4 overflow-hidden ${isClosing ? 'modal-exit' : ''}`}>
        <div className="modal-content-wrapper p-3 sm:p-4 md:p-6 lg:p-8 max-h-[88vh] sm:max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg mb-2">Organigrama del Equipo</h2>
              <p className="text-white/80 drop-shadow text-sm sm:text-base">Estructura organizacional del Málaga Space Team</p>
            </div>
            <button 
              onClick={handleClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          
          <div className="space-y-6 sm:space-y-8 lg:space-y-12">
            {/* Dirección del Proyecto */}
            <div className="text-center">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 drop-shadow">Dirección del Proyecto</h3>
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
                {directors.map((director, index) => (
                  <MemberCard key={index} member={director} isLarge={true} />
                ))}
              </div>
              
              {/* Líneas de conexión hacia abajo */}
              <div className="flex justify-center mt-6">
                <div className="w-px h-8 bg-white/30"></div>
              </div>
              <div className="flex justify-center">
                <div className="w-48 h-px bg-white/30"></div>
              </div>
              <div className="flex justify-center">
                <div className="w-px h-8 bg-white/30"></div>
              </div>
            </div>

            {/* Coordinadores del Proyecto */}
            <div className="text-center">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 drop-shadow">Coordinadores del Proyecto</h3>
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
                {coordinators.map((coordinator, index) => (
                  <MemberCard key={index} member={coordinator} isLarge={true} />
                ))}
              </div>
              
              {/* Líneas de conexión hacia abajo */}
              <div className="flex justify-center mt-6">
                <div className="w-px h-8 bg-white/30"></div>
              </div>
              <div className="flex justify-center">
                <div className="w-64 h-px bg-white/30"></div>
              </div>
              <div className="flex justify-center">
                <div className="w-px h-8 bg-white/30"></div>
              </div>
            </div>

            {/* Líderes de Subsistema */}
            <div className="text-center">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 drop-shadow">Líderes de Subsistema</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 justify-items-center">
                {subsystemLeaders.map((leader, index) => (
                  <MemberCard key={index} member={leader} />
                ))}
              </div>
              
              {/* Líneas de conexión hacia abajo */}
              <div className="flex justify-center mt-6">
                <div className="w-px h-8 bg-white/30"></div>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-2xl h-px bg-white/30"></div>
              </div>
              <div className="flex justify-center">
                <div className="w-px h-8 bg-white/30"></div>
              </div>
            </div>

            {/* Equipo de Desarrollo */}
            <div className="text-center">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 drop-shadow">Equipo de Desarrollo</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 justify-items-center">
                {developmentTeam.map((member, index) => (
                  <MemberCard key={index} member={member} />
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-6 mb-8">
              <h4 className="text-white font-semibold mb-3 text-sm sm:text-base">📊 Estadísticas del Equipo</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-300">25+</div>
                  <div className="text-white/80 text-sm">Miembros</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-green-300">6</div>
                  <div className="text-white/80 text-sm">Departamentos</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-purple-300">8</div>
                  <div className="text-white/80 text-sm">Disciplinas</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-orange-300">2+</div>
                  <div className="text-white/80 text-sm">Años</div>
                </div>
              </div>
            </div>
            
            <GlassButton onClick={handleClose} variant="primary" size="md">
              Cerrar Organigrama
            </GlassButton>
          </div>
        </div>
      </GlassContainer>
    </div>
  );
};