import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  }, [i18n]);

  const currentLanguage = useMemo(() => 
    i18n.language === 'es' ? 'ES' : 'EN', 
    [i18n.language]
  );

  const ariaLabel = useMemo(() => 
    `Switch to ${i18n.language === 'es' ? 'English' : 'Spanish'}`, 
    [i18n.language]
  );

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 text-white/90 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">{currentLanguage}</span>
    </button>
  );
};