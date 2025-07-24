import React, { useState, useRef, useEffect } from 'react';
import { X, User, GraduationCap, Cpu, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GlassContainer } from './GlassContainer';
import { GlassButton } from './GlassButton';
import { useNavigation } from './Navigation';
import { LiquidGlassToastCSS } from './LiquidGlassToastCSS';
import { sendEmailWithData, initializeEmailJS } from '../utils/emailService';

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinTeamModalEmailJS: React.FC<JoinTeamModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { hideNavigation, showNavigation } = useNavigation();
  const form = useRef<HTMLFormElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error" | "info"
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactReason: '',
    degree: '',
    year: '',
    interests: [] as string[],
    message: ''
  });

  const [showSubsystemsInfo, setShowSubsystemsInfo] = useState(false);

  const contactReasons = [
    t('team.joinModal.contactReason.reasons.joinTeam'),
    t('team.joinModal.contactReason.reasons.academicCollaboration'),
    t('team.joinModal.contactReason.reasons.sponsorship'),
    t('team.joinModal.contactReason.reasons.generalInfo')
  ];

  const years = [
    t('team.joinModal.academicInfo.years.firstGrade'),
    t('team.joinModal.academicInfo.years.secondGrade'),
    t('team.joinModal.academicInfo.years.thirdGrade'),
    t('team.joinModal.academicInfo.years.fourthGrade'),
    t('team.joinModal.academicInfo.years.firstMaster'),
    t('team.joinModal.academicInfo.years.secondMaster'),
    t('team.joinModal.academicInfo.years.phd'),
    t('team.joinModal.academicInfo.years.graduate')
  ];

  const subsystems = [
    { 
      name: t('team.joinModal.interests.subsystems.structure.name'), 
      description: t('team.joinModal.interests.subsystems.structure.description') 
    },
    { 
      name: t('team.joinModal.interests.subsystems.power.name'), 
      description: t('team.joinModal.interests.subsystems.power.description') 
    },
    { 
      name: t('team.joinModal.interests.subsystems.adcs.name'), 
      description: t('team.joinModal.interests.subsystems.adcs.description') 
    },
    { 
      name: t('team.joinModal.interests.subsystems.cdhs.name'), 
      description: t('team.joinModal.interests.subsystems.cdhs.description') 
    },
    { 
      name: t('team.joinModal.interests.subsystems.payload.name'), 
      description: t('team.joinModal.interests.subsystems.payload.description') 
    },
    { 
      name: t('team.joinModal.interests.subsystems.communications.name'), 
      description: t('team.joinModal.interests.subsystems.communications.description') 
    },
    { 
      name: t('team.joinModal.interests.subsystems.projectManagement.name'), 
      description: t('team.joinModal.interests.subsystems.projectManagement.description') 
    },
    { 
      name: t('team.joinModal.interests.subsystems.other.name'), 
      description: t('team.joinModal.interests.subsystems.other.description') 
    }
  ];

  useEffect(() => {
    // Initialize EmailJS when component mounts
    initializeEmailJS();
  }, []);

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const showToastMessage = (message: string, type: "success" | "error" | "info") => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.contactReason.trim() || !formData.message.trim()) {
      showToastMessage(t('team.joinModal.validation.requiredFields'), "error");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToastMessage(t('team.joinModal.validation.invalidEmail'), "error");
      return;
    }

    // Validate message length
    if (formData.message.length < 50) {
      showToastMessage(t('team.joinModal.validation.messageLength'), "error");
      return;
    }

    // Additional validation for join team requests
    if (formData.contactReason === t('team.joinModal.contactReason.reasons.joinTeam')) {
      if (!formData.degree.trim() || !formData.year.trim() || formData.interests.length === 0) {
        showToastMessage(t('team.joinModal.validation.academicInfo'), "error");
        return;
      }
    }

    setLoading(true);

    // Format the message for EmailJS template
    const emailData = {
      name: formData.name,
      email: formData.email,
      subject: `${formData.contactReason} - Solicitud de ${formData.name}`,
      message: `
Motivo del contacto: ${formData.contactReason}
${formData.contactReason === t('team.joinModal.contactReason.reasons.joinTeam') ? `
Grado/Carrera: ${formData.degree}
Curso actual: ${formData.year}
Áreas de interés: ${formData.interests.join(', ')}
` : ''}
Mensaje:
${formData.message}
      `.trim()
    };

    try {
      await sendEmailWithData(emailData);
      showToastMessage(t('team.joinModal.validation.success'), "success");
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        contactReason: '',
        degree: '',
        year: '',
        interests: [],
        message: ''
      });
      
      // Close modal after showing success message
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Email sending error:", error);
      showToastMessage(
        error instanceof Error ? error.message : t('team.joinModal.validation.error'),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <>
      <LiquidGlassToastCSS
        show={toast.show}
        message={toast.message}
        type={toast.type}
        duration={3000}
        onClose={() => setToast({ ...toast, show: false })}
      />
      
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-1 sm:p-2 md:p-4" data-modal>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}></div>
        
        <GlassContainer className={`modal-glass w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] mx-1 sm:mx-2 md:mx-4 overflow-hidden ${isClosing ? 'modal-exit' : ''}`}>
          <div className="modal-content-wrapper p-3 sm:p-4 md:p-6 lg:p-8 max-h-[88vh] sm:max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg mb-2">{t('team.joinModal.title')}</h2>
                <p className="text-white/80 drop-shadow text-sm sm:text-base">{t('team.joinModal.description')}</p>
              </div>
              <button 
                onClick={handleClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <form ref={form} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Información Personal */}
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center drop-shadow">
                  <User className="w-5 h-5 mr-2" />
                  {t('team.joinModal.personalInfo.title')}
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">{t('team.joinModal.personalInfo.name')}</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder={t('team.joinModal.personalInfo.namePlaceholder')}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">{t('team.joinModal.personalInfo.email')}</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder={t('team.joinModal.personalInfo.emailPlaceholder')}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Motivo del Contacto */}
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 drop-shadow">{t('team.joinModal.contactReason.title')}</h3>
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">{t('team.joinModal.contactReason.label')}</label>
                  <select 
                    value={formData.contactReason}
                    onChange={(e) => setFormData({...formData, contactReason: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                    required
                  >
                    <option value="" className="bg-gray-800">{t('team.joinModal.contactReason.placeholder')}</option>
                    {contactReasons.map((reason) => (
                      <option key={reason} value={reason} className="bg-gray-800">{reason}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Información Académica - Solo si es "Unirse al equipo" */}
              {formData.contactReason === t('team.joinModal.contactReason.reasons.joinTeam') && (
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center drop-shadow">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    {t('team.joinModal.academicInfo.title')}
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6">
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">{t('team.joinModal.academicInfo.degree')}</label>
                      <input 
                        type="text" 
                        value={formData.degree}
                        onChange={(e) => setFormData({...formData, degree: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                        placeholder={t('team.joinModal.academicInfo.degreePlaceholder')}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">{t('team.joinModal.academicInfo.year')}</label>
                      <select 
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                        required
                      >
                        <option value="" className="bg-gray-800">{t('team.joinModal.academicInfo.yearPlaceholder')}</option>
                        {years.map((year) => (
                          <option key={year} value={year} className="bg-gray-800">{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Área de Interés - Solo si es "Unirse al equipo" */}
              {formData.contactReason === t('team.joinModal.contactReason.reasons.joinTeam') && (
                <div>
                 <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center drop-shadow">
                    <Cpu className="w-5 h-5 mr-2" />
                    {t('team.joinModal.interests.title')}
                  </h3>
                  <div className="mb-4">
                    <label className="block text-white/80 text-sm font-semibold mb-3">
                      {t('team.joinModal.interests.label')}
                    </label>
                    <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2">
                      {subsystems.map((subsystem) => (
                        <label key={subsystem.name} className="flex items-center space-x-3 cursor-pointer p-2 sm:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.interests.includes(subsystem.name)}
                            onChange={() => handleInterestChange(subsystem.name)}
                            className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                          />
                          <span className="text-white/90 font-medium">{subsystem.name}</span>
                        </label>
                      ))}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setShowSubsystemsInfo(!showSubsystemsInfo)}
                      className="mt-4 text-blue-300 hover:text-blue-200 text-sm transition-colors"
                    >
                      {showSubsystemsInfo ? t('team.joinModal.interests.hideInfo') : t('team.joinModal.interests.showInfo')}
                    </button>
                    
                    {showSubsystemsInfo && (
                      <div className="mt-4 p-4 bg-white/5 rounded-lg">
                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                          {subsystems.map((subsystem) => (
                            <div key={subsystem.name} className="text-sm">
                              <span className="text-white font-semibold">{subsystem.name}:</span>
                              <span className="text-white/70 ml-2">{subsystem.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mensaje */}
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 drop-shadow">{t('team.joinModal.message.title')}</h3>
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">
                    {formData.contactReason === t('team.joinModal.contactReason.reasons.joinTeam') 
                      ? t('team.joinModal.message.labelJoin')
                      : t('team.joinModal.message.labelDefault')
                    }
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                    placeholder={formData.contactReason === t('team.joinModal.contactReason.reasons.joinTeam') 
                      ? t('team.joinModal.message.placeholderJoin')
                      : t('team.joinModal.message.placeholderDefault')
                    }
                    minLength={50}
                    maxLength={500}
                    required
                  />
                  <div className="text-right text-white/60 text-sm mt-2">
                    {t('team.joinModal.message.counterText')} • {formData.message.length}/500
                  </div>
                </div>
              </div>

              {/* Información Importante */}
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3 sm:p-4 md:p-6">
                <h4 className="text-white font-semibold mb-3 flex items-center">
                  {t('team.joinModal.importantInfo.title')}
                </h4>
                <ul className="text-white/80 text-xs sm:text-sm space-y-1 sm:space-y-2">
                  {formData.contactReason === t('team.joinModal.contactReason.reasons.joinTeam') && (
                    <>
                      {(t('team.joinModal.importantInfo.joinItems', { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </>
                  )}
                  <li>• {t('team.joinModal.importantInfo.generalItem')}</li>
                </ul>
              </div>

              {/* Botón de envío */}
              <div className="text-center">
                <GlassButton type="submit" variant="primary" size="lg" disabled={loading}>
                  <div className="flex items-center justify-center space-x-3">
                    <Send className="w-5 h-5" />
                    <span>
                      {loading ? t('team.joinModal.loading') : t('team.joinModal.submitButton')}
                    </span>
                  </div>
                </GlassButton>
              </div>
            </form>
          </div>
        </GlassContainer>
      </div>
    </>
  );
};