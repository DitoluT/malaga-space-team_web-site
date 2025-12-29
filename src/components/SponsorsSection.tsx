import React, { useState, useEffect } from 'react';
import { ExternalLink, Users, Lightbulb, Link as LinkIcon, Rocket, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GlassContainer } from './GlassContainer';
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
  image_url?: string;
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {sponsors.map((collaborator, index) => {
                const Icon = iconMap[collaborator.icon] || Users;
                return (
                  <a
                    key={index}
                    href={collaborator.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <GlassContainer className="collaboration-glass h-full overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
                        <div className="flex flex-col h-full">
                            {/* Image Area - Top Half */}
                            <div className="h-48 relative overflow-hidden bg-white/5 flex items-center justify-center">
                                {/* Optional gradient overlay */}
                                <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${collaborator.color || 'from-blue-400 to-blue-600'}`} />

                                {collaborator.image_url ? (
                                    <img
                                        src={collaborator.image_url}
                                        alt={collaborator.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <Icon className="w-20 h-20 text-white/40" />
                                )}
                            </div>

                            {/* Content Area - Bottom Half */}
                            <div className="p-6 flex flex-col flex-grow text-center">
                                <h3 className="text-xl font-bold text-white mb-2">{collaborator.name}</h3>
                                <p className="text-sm font-semibold text-blue-300 mb-4">{collaborator.role}</p>

                                {/* Contribution Badge */}
                                {collaborator.contribution && (
                                    <div className="mb-4">
                                        <div className="bg-white/5 rounded-lg p-2 inline-block">
                                            <p className="text-white/90 text-xs font-medium px-2">
                                                {collaborator.contribution}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Description - clamp */}
                                <p className="text-xs text-white/60 line-clamp-2 mb-4">
                                    {collaborator.description}
                                </p>

                                <div className="mt-auto pt-2 flex justify-center items-center text-blue-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                                    <span>{t('sponsors.visitWebsite')}</span>
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                </div>
                            </div>
                        </div>
                    </GlassContainer>
                  </a>
                );
            })}
            </div>
        )}
      </div>
    </section>
  );
};
