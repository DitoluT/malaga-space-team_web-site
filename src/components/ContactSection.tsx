import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { GlassContainer } from './GlassContainer';
import { GlassButton } from './GlassButton';

export const ContactSection: React.FC = () => {
  return (
    <section id="contacto" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <GlassContainer className="section-glass mb-16">
          <div className="p-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Contacto</h2>
            <p className="text-lg text-white/80">
              ¿Tienes preguntas sobre el proyecto? ¿Quieres unirte al equipo? ¡Contáctanos!
            </p>
          </div>
        </GlassContainer>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <GlassContainer className="contact-info-glass">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Información de Contacto</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-lg">
                    <Mail className="w-6 h-6 text-white/90" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Coordinación</h4>
                    <p className="text-blue-300 font-semibold">spaceteam@uma.es</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-lg">
                    <Phone className="w-6 h-6 text-white/90" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Teléfono</h4>
                    <p className="text-green-300 font-semibold">+34 952 13 71 00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-lg">
                    <MapPin className="w-6 h-6 text-white/90" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Ubicación</h4>
                    <p className="text-purple-300 font-semibold">Universidad de Málaga</p>
                    <p className="text-white/70">29071 Málaga, España</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassContainer>

          {/* Contact Form */}
          <GlassContainer className="contact-form-glass">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Envíanos un Mensaje</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">Nombre</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">Asunto</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Asunto del mensaje"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">Mensaje</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                    placeholder="Escribe tu mensaje aquí..."
                  ></textarea>
                </div>
                
                <GlassButton variant="primary" size="lg" onClick={(e) => e.preventDefault()}>
                  <div className="flex items-center justify-center space-x-3">
                    <Send className="w-5 h-5" />
                    <span>Enviar Mensaje</span>
                  </div>
                </GlassButton>
              </form>
            </div>
          </GlassContainer>
        </div>
      </div>
    </section>
  );
};