import React, { useMemo } from 'react';
import { ExternalLink, Users, Lightbulb, Link as LinkIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GlassContainer } from './GlassContainer';
import { GlassButton } from './GlassButton';

export const SponsorsSection: React.FC = () => {
  const { t } = useTranslation();

  const collaborators = useMemo(() => [
    {
      name: t('sponsors.collaborators.uma.name'),
      shortName: t('sponsors.collaborators.uma.shortName'),
      description: t('sponsors.collaborators.uma.description'),
      role: t('sponsors.collaborators.uma.role'),
      icon: Users,
      color: "from-blue-400 to-blue-600",
      website: "https://www.uma.es/",
      contribution: t('sponsors.collaborators.uma.contribution')
    },
    {
      name: t('sponsors.collaborators.mobilenet.name'),
      shortName: t('sponsors.collaborators.mobilenet.shortName'),
      description: t('sponsors.collaborators.mobilenet.description'),
      role: t('sponsors.collaborators.mobilenet.role'),
      icon: Lightbulb,
      color: "from-green-400 to-green-600",
      website: "https://mobilenet.uma.es/",
      contribution: t('sponsors.collaborators.mobilenet.contribution')
    },
    {
      name: t('sponsors.collaborators.link.name'),
      shortName: t('sponsors.collaborators.link.shortName'),
      description: t('sponsors.collaborators.link.description'),
      role: t('sponsors.collaborators.link.role'),
      icon: LinkIcon,
      color: "from-purple-400 to-purple-600",
      website: "https://www.link.uma.es/",
      contribution: t('sponsors.collaborators.link.contribution')
    }
  ], [t]);

  const collaborationBenefits = useMemo(() => [
    {
      title: t('sponsors.benefits.advancedResearch.title'),
      description: t('sponsors.benefits.advancedResearch.description')
    },
    {
      title: t('sponsors.benefits.techTransfer.title'),
      description: t('sponsors.benefits.techTransfer.description')
    },
    {
      title: t('sponsors.benefits.specializedTraining.title'),
      description: t('sponsors.benefits.specializedTraining.description')
    }
  ], [t]);

  return (
    <section id="patrocinadores" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <GlassContainer className="section-glass mb-16">
          <div className="p-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">{t('sponsors.title')}</h2>
            <p className="text-lg text-white/80">
              {t('sponsors.description')}
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
                    {t('sponsors.contributionLabel')}
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
                  <span className="text-sm">{t('sponsors.visitWebsite')}</span>
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