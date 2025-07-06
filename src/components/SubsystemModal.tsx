import React, { useState } from 'react';
import { X } from 'lucide-react';
import { GlassContainer } from './GlassContainer';
import { GlassButton } from './GlassButton';
import { useNavigation } from './Navigation';

interface SubsystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  subsystem: {
    title: string;
    description: string;
    details: {
      components: string[];
      specifications: string[];
      status: string;
      challenges: string[];
    };
  } | null;
}

export const SubsystemModal: React.FC<SubsystemModalProps> = ({ isOpen, onClose, subsystem }) => {
  const { hideNavigation, showNavigation } = useNavigation();
  const [isClosing, setIsClosing] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      hideNavigation();
      setIsClosing(false);
      // Prevenir scroll del body
      document.body.style.overflow = 'hidden';
    } else {
      showNavigation();
      // Restaurar scroll del body
      document.body.style.overflow = 'unset';
    }

    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, hideNavigation, showNavigation]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen || !subsystem) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-1 sm:p-2 md:p-4" data-modal>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}></div>
      
      <GlassContainer className={`modal-glass w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] mx-1 sm:mx-2 md:mx-4 overflow-hidden ${isClosing ? 'modal-exit' : ''}`}>
        <div className="modal-content-wrapper p-3 sm:p-4 md:p-6 lg:p-8 max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg pr-4">{subsystem.title}</h2>
            <button 
              onClick={handleClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          
          <p className="text-white/90 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 lg:mb-8 leading-relaxed drop-shadow">{subsystem.description}</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 drop-shadow">Componentes Principales</h3>
              <ul className="space-y-2">
                {subsystem.details.components.map((component, index) => (
                  <li key={index} className="text-white/80 drop-shadow flex items-center text-sm sm:text-base">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    {component}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 drop-shadow">Especificaciones</h3>
              <ul className="space-y-2">
                {subsystem.details.specifications.map((spec, index) => (
                  <li key={index} className="text-white/80 drop-shadow flex items-center text-sm sm:text-base">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6 lg:mt-8">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 drop-shadow">Estado del Desarrollo</h3>
            <p className="text-white/80 mb-3 sm:mb-4 lg:mb-6 drop-shadow text-sm sm:text-base">{subsystem.details.status}</p>
            
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 drop-shadow">Desafíos Técnicos</h3>
            <ul className="space-y-2 mb-4 sm:mb-6 lg:mb-8">
              {subsystem.details.challenges.map((challenge, index) => (
                <li key={index} className="text-white/80 drop-shadow flex items-center text-sm sm:text-base">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="text-center">
            <GlassButton onClick={handleClose} variant="primary" size="md">
              Cerrar Detalles
            </GlassButton>
          </div>
        </div>
      </GlassContainer>
    </div>
  );
};