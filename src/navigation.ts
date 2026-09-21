import { CONTACT, getDictionary, route, otherLang } from '~/i18n';
import type { Lang, RouteKey } from '~/i18n';

export const getHeaderData = (lang: Lang, page: RouteKey = 'home') => {
  const t = getDictionary(lang);
  const home = (hash: string) => route('home', lang, hash);

  return {
    links: [
      { text: t.navigation.about, href: home('#acerca') },
      { text: t.navigation.subsystems, href: home('#subsistemas') },
      { text: t.navigation.team, href: home('#equipo') },
      { text: t.navigation.sponsors, href: home('#colaboradores') },
      { text: t.navigation.contact, href: home('#contacto') },
    ],
    actions: [{ text: t.navigation.joinTeam, href: route('join', lang), variant: 'primary' as const }],
    langSwitch: { text: t.extra.switchTo, href: route(page, otherLang(lang)), lang: otherLang(lang) },
  };
};

export const getFooterData = (lang: Lang) => {
  const t = getDictionary(lang);
  const home = (hash: string) => route('home', lang, hash);

  return {
    description: t.footer.description,
    links: [
      {
        title: t.footer.quickLinks,
        links: [
          { text: t.footer.quickLinksItems.about, href: home('#acerca') },
          { text: t.footer.quickLinksItems.subsystems, href: home('#subsistemas') },
          { text: t.footer.quickLinksItems.team, href: home('#equipo') },
          { text: t.footer.quickLinksItems.contact, href: home('#contacto') },
        ],
      },
      {
        title: t.footer.contactInfo,
        links: [
          { text: CONTACT.email, href: `mailto:${CONTACT.email}` },
          { text: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, '')}` },
          { text: `${t.contact.address}, ${t.contact.city}` },
        ],
      },
      {
        title: t.navigation.team,
        links: [
          { text: t.navigation.joinTeam, href: route('join', lang) },
          { text: t.extra.teamLive.alumniLink, href: route('alumni', lang) },
          { text: t.extra.social, href: CONTACT.social },
          { text: t.extra.inventory, href: '/inventario' },
        ],
      },
    ],
    secondaryLinks: [],
    socialLinks: [
      { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: CONTACT.linkedin },
      { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: CONTACT.instagram },
      { ariaLabel: 'Email', icon: 'tabler:mail', href: `mailto:${CONTACT.email}` },
    ],
    footNote: t.footer.copyright.replace('2025', String(new Date().getFullYear())),
  };
};
