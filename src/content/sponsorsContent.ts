import { ExternalLink, Users, Lightbulb, Link as LinkIcon } from 'lucide-react';

export const sponsorsContent = {
  title: "Nuestros Colaboradores",
  description: "El proyecto CubeSat cuenta con el apoyo de instituciones líderes de la Universidad de Málaga",
  collaborators: [
    {
      name: "Universidad de Málaga",
      shortName: "UMA",
      description: "Institución pública española fundada en 1972 que ofrece más de 60 titulaciones de grado y más de 100 de posgrado, con cerca de 40,000 estudiantes y 2,450 profesores distribuidos en 19 centros universitarios.",
      role: "Institución Principal",
      icon: Users,
      website: "https://www.uma.es/",
      contribution: "Apoyo institucional, infraestructura y recursos académicos"
    },
    {
      name: "Mobile & Aerospace Networks Lab",
      shortName: "MobileNet",
      description: "Grupo de investigación especializado en redes de próxima generación e inteligencia artificial aplicada a redes inalámbricas. Cuenta con más de 30 investigadores y una infraestructura avanzada para el desarrollo tecnológico.",
      role: "Laboratorio de Investigación",
      icon: Lightbulb,
      website: "https://mobilenet.uma.es/",
      contribution: "Expertise técnico, investigación y desarrollo tecnológico"
    },
    {
      name: "LINK by UMA-ATech",
      shortName: "Link Bayuma",
      description: "Espacio de encuentro real entre la Universidad de Málaga y las empresas, dedicado a la innovación y el emprendimiento. Facilita la colaboración universidad-industria.",
      role: "Hub de Innovación",
      icon: LinkIcon,
      website: "https://www.link.uma.es/",
      contribution: "Conexión industrial, transferencia de conocimiento y emprendimiento"
    }
  ],
  collaborationBenefits: [
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
  ]
};