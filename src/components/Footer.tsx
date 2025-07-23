import React, { useMemo } from 'react';
import { Rocket, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GlassContainer } from './GlassContainer';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  const quickLinks = useMemo(() => [
    { name: t('footer.quickLinksItems.home'), href: "#inicio" },
    { name: t('footer.quickLinksItems.about'), href: "#acerca" },
    { name: t('footer.quickLinksItems.subsystems'), href: "#subsistemas" },
    { name: t('footer.quickLinksItems.team'), href: "#equipo" },
    { name: t('footer.quickLinksItems.contact'), href: "#contacto" }
  ], [t]);

  return (
    <footer className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <GlassContainer className="footer-glass">
          <div className="p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Logo and Description */}
              <div className="md:col-span-1">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
                    <Rocket className="w-6 h-6 text-white/90 transform rotate-45" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Málaga Space Team</h3>
                  </div>
                </div>
                <p className="text-white/80 leading-relaxed">
                  {t('footer.description')}
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-xl font-bold text-white mb-6">{t('footer.quickLinks')}</h4>
                <ul className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href}
                        className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-xl font-bold text-white mb-6">{t('footer.contactInfo')}</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-300" />
                    <span className="text-white/80">spaceteam@uma.es</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-green-300" />
                    <span className="text-white/80">+34 952 13 71 00</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-purple-300 mt-1" />
                    <div>
                      <p className="text-white/80">{t('contact.address')}</p>
                      <p className="text-white/60">{t('contact.city')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/20 mt-12 pt-8 text-center">
              <p className="text-white/60">
                {t('footer.copyright')}
              </p>
            </div>
          </div>
        </GlassContainer>
      </div>
    </footer>
  );
};