import React from 'react';
import { ExternalLink, Users, Lightbulb, Link as LinkIcon } from 'lucide-react';
import { GlassContainer } from './GlassContainer';
import { GlassButton } from './GlassButton';

export const SponsorsSection: React.FC = () => {
  const collaborators = [
    {
      name: "Universidad de Málaga",
      shortName: "UMA",
      description: "Institución pública española fundada en 1972 que ofrece más de 60 titulaciones de grado y más de 100 de posgrado, con cerca de 40,000 estudiantes y 2,450 profesores distribuidos en 19 centros universitarios.",
      role: "Institución Principal",
      icon: Users,
      color: "from-blue-400 to-blue-600",
      website: "https://www.uma.es/",
      contribution: "Apoyo institucional, infraestructura y recursos académicos"
    },
    {
      name: "Mobile & Aerospace Networks Lab",
      shortName: "MobileNet",
      description: "Grupo de investigación especializado en redes de próxima generación e inteligencia artificial aplicada a redes inalámbricas. Cuenta con más de 30 investigadores y una infraestructura avanzada para el desarrollo tecnológico.",
      role: "Laboratorio de Investigación",
      icon: Lightbulb,
      color: "from-green-400 to-green-600",
      website: "https://mobilenet.uma.es/",
      contribution: "Expertise técnico, investigación y desarrollo tecnológico"
    },
    {
      name: "LINK by UMA-ATech",
      shortName: "Link Bayuma",
      description: "Espacio de encuentro real entre la Universidad de Málaga y las empresas, dedicado a la innovación y el emprendimiento. Facilita la colaboración universidad-industria.",
      role: "Hub de Innovación",
      icon: LinkIcon,
      color: "from-purple-400 to-purple-600",
      website: "https://www.link.uma.es/",
      contribution: "Conexión industrial, transferencia de conocimiento y emprendimiento"
    }
  ];

  const collaborationBenefits = [
    {
      title: "Investigación Avanzada",
      description: "Acceso a infraestructura de investigación de vanguardia"
    },
    {
      title: "Transferencia Tecnológica",
      description: "Puente entre universidad e industria espacial"
    },
    {
      title: "Formación Especializada",
      description: "Desarrollo de talento en tecnología espacial"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <GlassContainer className="section-glass mb-16">
          <div className="p-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Nuestros Colaboradores</h2>
            <p className="text-lg text-white/80">
              El proyecto CubeSat cuenta con el apoyo de instituciones líderes de la Universidad de Málaga
            </p>
          </div>
        </GlassContainer>

        {/* Main Collaborators */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {collaborators.map((collaborator, index) => (
            <GlassContainer key={index} className="collaboration-glass">
              <div className="p-6 text-center">
                <div className={`inline-flex w-12 h-12 bg-gradient-to-br ${collaborator.color} rounded-full items-center justify-center mb-4`}>
                  <collaborator.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{collaborator.name}</h3>
                <p className="text-sm font-semibold text-blue-300 mb-3">{collaborator.role}</p>
                <p className="text-sm text-white/80 leading-relaxed mb-4">{collaborator.description}</p>
                
                <div className="bg-white/5 rounded-lg p-3 mb-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center justify-center text-sm">
                    🤝 Contribución
                  </h4>
                  <p className="text-white/80 text-xs">{collaborator.contribution}</p>
                </div>
                
                <a 
                  href={collaborator.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors group text-sm"
                >
                  <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Visitar sitio web</span>
                </a>
              </div>
            </GlassContainer>
          ))}
        </div>

        {/* Description */}
        <div className="lg:col-span-2">
          <p className="text-white/90 text-base md:text-lg leading-relaxed mb-4 md:mb-6">{collaborator.description}</p>
          
          <div className="bg-white/5 rounded-lg p-3 md:p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center text-sm md:text-base">
              🤝 Contribución al Proyecto
            </h4>
            <p className="text-white/80 text-sm md:text-base">{collaborator.contribution}</p>
          </div>
        </div>

        {/* Collaboration Benefits */}
        <GlassContainer className="become-sponsor-glass mb-16">
          <div className="p-6 md:p-8 lg:p-12">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 md:mb-8 text-center">Sinergia Colaborativa</h3>
            <p className="text-lg md:text-xl text-white/80 mb-8 md:mb-12 text-center">
              La colaboración entre estas instituciones crea un ecosistema ideal para el desarrollo del proyecto CubeSat
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
              {collaborationBenefits.map((benefit, index) => (
                <div key={index} className="text-center bg-white/5 rounded-lg p-4 md:p-6">
                  <h4 className="text-lg md:text-xl font-bold text-white mb-3">{benefit.title}</h4>
                  <p className="text-white/80 text-sm md:text-base">{benefit.description}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 md:p-6">
                <h4 className="text-white font-semibold mb-3 flex items-center justify-center text-sm md:text-base">
                  🎯 Impacto del Proyecto
                </h4>
                <p className="text-white/80 max-w-4xl mx-auto text-sm md:text-base leading-relaxed">
                  Esta colaboración multidisciplinaria permite combinar la excelencia académica de la UMA, 
                  la investigación avanzada de MobileNet y la conexión industrial de LINK, 
                  creando un proyecto CubeSat con potencial de transferencia tecnológica real.
                </p>
              </div>
            </div>
          </div>
        </GlassContainer>

        {/* Future Collaborations Call */}
        <GlassContainer className="collaboration-glass">
          <div className="p-6 md:p-8 lg:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">¿Interesado en Colaborar?</h3>
            <p className="text-lg md:text-xl text-white/80 mb-6 md:mb-8">
              Estamos abiertos a nuevas colaboraciones con empresas, instituciones y organizaciones 
              que compartan nuestra visión de avanzar en la tecnología espacial.
            </p>
            
            <GlassButton variant="accent" size="lg" onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}>
              Información de Colaboración
            </GlassButton>
          </div>
        </GlassContainer>
      </div>
    </section>
  );
};