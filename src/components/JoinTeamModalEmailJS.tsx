import React, { useState, useRef, useEffect } from 'react';
import { X, User, GraduationCap, Cpu, Send } from 'lucide-react';
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
    'Unirse al equipo',
    'Colaboración académica',
    'Patrocinio',
    'Información general'
  ];

  const years = [
    '1º Grado',
    '2º Grado', 
    '3º Grado',
    '4º Grado',
    '1º Máster',
    '2º Máster',
    'Doctorado',
    'Egresado'
  ];

  const subsystems = [
    { name: 'Estructura', description: 'Diseño mecánico y materiales' },
    { name: 'Energía', description: 'Paneles solares y baterías' },
    { name: 'ADCS (Control de Actitud)', description: 'Control de orientación y estabilidad' },
    { name: 'CDHS (Comando y Manejo de Datos)', description: 'Procesamiento y almacenamiento de datos' },
    { name: 'Payload / Carga Útil', description: 'Instrumentos científicos' },
    { name: 'Comunicaciones', description: 'Enlace con estaciones terrestres' },
    { name: 'Gestión de Proyectos', description: 'Coordinación y administración' },
    { name: 'Otro', description: 'Especificar en el mensaje' }
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
      showToastMessage("Por favor, completa todos los campos obligatorios.", "error");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToastMessage("Por favor, ingresa un email válido.", "error");
      return;
    }

    // Validate message length
    if (formData.message.length < 50) {
      showToastMessage("El mensaje debe tener al menos 50 caracteres.", "error");
      return;
    }

    // Additional validation for join team requests
    if (formData.contactReason === 'Unirse al equipo') {
      if (!formData.degree.trim() || !formData.year.trim() || formData.interests.length === 0) {
        showToastMessage("Por favor, completa la información académica y selecciona al menos un área de interés.", "error");
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
${formData.contactReason === 'Unirse al equipo' ? `
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
      showToastMessage("¡Solicitud enviada con éxito! Te contactaremos pronto.", "success");
      
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
        error instanceof Error ? error.message : "Error al enviar la solicitud. Por favor, intenta de nuevo.",
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
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg mb-2">Únete o Colabora</h2>
                <p className="text-white/80 drop-shadow text-sm sm:text-base">Forma parte del Proyecto CubeSat de la Universidad de Málaga o colabora con nosotros</p>
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
                  Información Personal
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">Nombre Completo *</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="Ej: Juan Pérez García"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">Correo Electrónico *</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="juan.perez@uma.es"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Motivo del Contacto */}
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 drop-shadow">Motivo del Contacto</h3>
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">¿Por qué quieres contactar con nosotros? *</label>
                  <select 
                    value={formData.contactReason}
                    onChange={(e) => setFormData({...formData, contactReason: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                    required
                  >
                    <option value="" className="bg-gray-800">Selecciona el motivo de contacto</option>
                    {contactReasons.map((reason) => (
                      <option key={reason} value={reason} className="bg-gray-800">{reason}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Información Académica - Solo si es "Unirse al equipo" */}
              {formData.contactReason === 'Unirse al equipo' && (
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center drop-shadow">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Información Académica
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6">
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">Grado/Carrera que estudias *</label>
                      <input 
                        type="text" 
                        value={formData.degree}
                        onChange={(e) => setFormData({...formData, degree: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                        placeholder="Ej: Ingeniería de Telecomunicación"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">Curso actual *</label>
                      <select 
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                        required
                      >
                        <option value="" className="bg-gray-800">Selecciona tu curso</option>
                        {years.map((year) => (
                          <option key={year} value={year} className="bg-gray-800">{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Área de Interés - Solo si es "Unirse al equipo" */}
              {formData.contactReason === 'Unirse al equipo' && (
                <div>
                 <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center drop-shadow">
                    <Cpu className="w-5 h-5 mr-2" />
                    Área de Interés
                  </h3>
                  <div className="mb-4">
                    <label className="block text-white/80 text-sm font-semibold mb-3">
                      ¿En qué áreas del proyecto te gustaría trabajar? * (puedes seleccionar varias)
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
                      ℹ️ {showSubsystemsInfo ? 'Ocultar' : 'Ver'} información sobre los subsistemas
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
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 drop-shadow">Mensaje</h3>
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">
                    {formData.contactReason === 'Unirse al equipo' 
                      ? 'Cuéntanos sobre tu motivación para unirte al equipo *'
                      : 'Cuéntanos más sobre tu consulta *'
                    }
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                    placeholder={formData.contactReason === 'Unirse al equipo' 
                      ? 'Describe tu experiencia, motivación y cómo te gustaría contribuir al proyecto CubeSat...'
                      : 'Describe tu consulta...'
                    }
                    minLength={50}
                    maxLength={500}
                    required
                  />
                  <div className="text-right text-white/60 text-sm mt-2">
                    Mínimo 50 caracteres • {formData.message.length}/500
                  </div>
                </div>
              </div>

              {/* Información Importante */}
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3 sm:p-4 md:p-6">
                <h4 className="text-white font-semibold mb-3 flex items-center">
                  📋 Información Importante
                </h4>
                <ul className="text-white/80 text-xs sm:text-sm space-y-1 sm:space-y-2">
                  {formData.contactReason === 'Unirse al equipo' && (
                    <>
                      <li>• El proyecto está abierto a estudiantes de todas las disciplinas</li>
                      <li>• Se requiere compromiso y dedicación para el desarrollo del CubeSat 2U</li>
                      <li>• Oportunidad de aprendizaje práctico en tecnología espacial</li>
                    </>
                  )}
                  <li>• Contactaremos contigo en un plazo de 3-5 días laborables</li>
                </ul>
              </div>

              {/* Botón de envío */}
              <div className="text-center">
                <GlassButton type="submit" variant="primary" size="lg" disabled={loading}>
                  <div className="flex items-center justify-center space-x-3">
                    <Send className="w-5 h-5" />
                    <span>{loading ? "Enviando..." : "Enviar Solicitud"}</span>
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