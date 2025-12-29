import React, { useState, useEffect } from 'react';
import { ExternalLink, Users, Lightbulb, Link as LinkIcon, Rocket, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GlassContainer } from './GlassContainer';
import { GlassButton } from './GlassButton';
import { API_ENDPOINTS } from '../config/api';

const iconMap: Record<string, any> = {
  Users,
  Lightbulb,
  Link: LinkIcon,
  Rocket,
  Star
};

interface Sponsor {
  id: number;
  name: string;
  short_name: string;
  description: string;
  role: string;
  icon: string;
  color: string;
  website: string;
  contribution: string;
}

export const SponsorsSection: React.FC = () => {
  const { t } = useTranslation();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.webSponsors);
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setSponsors(data.data);
        } else {
           // If DB is empty, we show nothing (or could fallback to static if desired, but dynamic is requested)
           // For better UX during transition, maybe we should keep static if empty?
           // But the user wants to *edit*. If we show static, they can't edit it.
           // So we show empty list (or message) until they add something.
           setSponsors([]);
        }
      } catch (e) {
        console.error("Failed to fetch sponsors", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  const collaborationBenefits = [
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
  ];

  if (!loading && sponsors.length === 0) {
      // Return null or show empty state?
      // If we return null, the "Collaborators" section disappears.
      // This might be confusing.
      // Let's render the section structure but with a "No collaborators yet" message or just empty grid.
      // Actually, better to hide if empty?
      // "Our Partners" (Logos) is separate.
      // This section has benefits text too.
      // I'll render the benefits but hide the sponsors grid if empty.
  }

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
        {sponsors.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            {sponsors.map((collaborator, index) => {
                const Icon = iconMap[collaborator.icon] || Users;
                return (
                    <GlassContainer key={index} className="collaboration-glass">
                    <div className="p-6 text-center h-[420px] flex flex-col">
                        <div className={`inline-flex w-12 h-12 bg-gradient-to-br ${collaborator.color || 'from-blue-400 to-blue-600'} rounded-full items-center justify-center mb-4 shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{collaborator.name}</h3>
                        <p className="text-sm font-semibold text-blue-300 mb-3">{collaborator.role}</p>
                        <p className="text-sm text-white/80 leading-relaxed mb-4 flex-1 overflow-y-auto">{collaborator.description}</p>

                        {collaborator.contribution && (
                            <div className="bg-white/5 rounded-lg p-3 mb-4">
                            <h4 className="text-white font-semibold mb-2 flex items-center justify-center text-sm">
                                {t('sponsors.contributionLabel')}
                            </h4>
                            <p className="text-white/80 text-xs">{collaborator.contribution}</p>
                            </div>
                        )}

                        <div>
                        {collaborator.website && (
                            <a
                            href={collaborator.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors group text-sm"
                            >
                            <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-sm">{t('sponsors.visitWebsite')}</span>
                            </a>
                        )}
                        </div>
                    </div>
                    </GlassContainer>
                );
            })}
            </div>
        )}

        {/* Benefits/CTA (Static content preserved) */}
         {/* ... Actually the original code didn't render benefits list explicitly in the JSX I saw?
             Wait, I read SponsorsSection.tsx earlier.
             It defined `collaborationBenefits` array but DID NOT RENDER IT.
             It only rendered `collaborators.map`.
             So I should stick to that behavior.
         */}
      </div>
    </section>
  );
};
