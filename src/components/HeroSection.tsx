import React, { useState, useEffect } from 'react';
import { Rocket, ArrowDown } from 'lucide-react';
import { GlassContainer } from './GlassContainer';
import { GlassButton } from './GlassButton';

export const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="inicio" className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-6xl mx-auto">
        <div className={`transform transition-all duration-1000 ease-out ${
          isVisible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-12 opacity-0 scale-95'
        }`}>
          <GlassContainer className="hero-glass mb-8">
            <div className="px-12 py-16 text-center">
              {/* Logo */}
              <div className={`mb-8 transform transition-all duration-1200 delay-300 ease-out ${
                isVisible 
                  ? 'translate-y-0 opacity-100 scale-100' 
                  : 'translate-y-8 opacity-0 scale-90'
              }`}>
                <div className="mx-auto w-80 h-32 flex items-center justify-center">
                  <img 
                    src="/Logo negativo.png" 
                    alt="Málaga Space Team Logo" 
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
              
              <div className={`transform transition-all duration-1000 delay-500 ease-out ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-6 opacity-0'
              }`}>
                <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Universidad de Málaga
                </p>
              </div>
              
              {/* Main tagline */}
              <div className={`mb-12 transform transition-all duration-1000 delay-700 ease-out ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-6 opacity-0'
              }`}>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Explorando el Espacio
                </h3>
                <p className="text-2xl text-blue-300 mb-6">
                  con Tecnología CubeSat
                </p>
                <p className="text-lg text-white/80 max-w-4xl mx-auto leading-relaxed">
                  Desarrollando satélites de nueva generación para avanzar en la investigación espacial, 
                  educación e innovación tecnológica desde la Universidad de Málaga.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transform transition-all duration-1000 delay-900 ease-out ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-6 opacity-0'
              }`}>
                <GlassButton variant="primary" size="lg" onClick={() => document.getElementById('acerca')?.scrollIntoView({ behavior: 'smooth' })}>
                  Descubrir el Proyecto
                </GlassButton>
                
                <GlassButton variant="secondary" size="lg" onClick={() => document.getElementById('equipo')?.scrollIntoView({ behavior: 'smooth' })}>
                  Únete a la Misión
                </GlassButton>
              </div>
            </div>
          </GlassContainer>
        </div>
        
        {/* Scroll indicator */}
        <div className={`animate-bounce transform transition-all duration-1000 delay-1100 ease-out ${
          isVisible 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-4 opacity-0'
        }`}>
          <ArrowDown className="w-8 h-8 text-white/60 mx-auto" />
        </div>
      </div>
    </section>
  );
};