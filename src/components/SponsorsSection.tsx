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
    <section id="patrocinadores" className="py-20 px-4">
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
              <div className="p-6 text-center h-[420px] flex flex-col">
                <div className="inline-flex w-12 h-12 bg-white/10 border border-white/20 rounded-full items-center justify-center mb-4 backdrop-blur-sm shadow-lg">
                  <collaborator.icon className="w-6 h-6 text-white/90" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{collaborator.name}</h3>
                <p className="text-sm font-semibold text-blue-300 mb-3">{collaborator.role}</p>
                <p className="text-sm text-white/80 leading-relaxed mb-4 flex-1">{collaborator.description}</p>
                
                <div className="bg-white/5 rounded-lg p-3 mb-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center justify-center text-sm">
                    🤝 Contribución
                  </h4>
                  <p className="text-white/80 text-xs">{collaborator.contribution}</p>
                </div>
                
                <div>
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
              </div>
            </GlassContainer>
          ))}
        </div>
      </div>
    </section>
  );
};