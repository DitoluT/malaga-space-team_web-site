import es from './es.json';
import en from './en.json';

export type Lang = 'es' | 'en';
export const LANGS: Lang[] = ['es', 'en'];
export const DEFAULT_LANG: Lang = 'es';

// Textos que no estaban en los JSON heredados de la web anterior
const extra = {
  es: {
    langName: 'Español',
    switchTo: 'English',
    heroTitle: 'El equipo de estudiantes malagueño',
    heroTitleMuted: 'para la investigación espacial',
    stats: { degrees: 'Carreras distintas', degreesDesc: 'Equipo interdisciplinar' },
    openMenu: 'Abrir menú',
    partners: {
      title: 'Patrocinadores',
      description: 'Empresas y entidades que hacen posible el proyecto con su patrocinio.',
    },
    teamLive: {
      title: 'Quiénes somos',
      description: 'Las personas que hacen posible el proyecto, por áreas de trabajo.',
      alumniLink: 'Antiguos miembros',
      alumniEmpty: 'Todavía no hay antiguos miembros registrados.',
      departments: {
        professors: 'Profesorado',
        management: 'Dirección y Coordinación',
        structure_energy: 'Estructura y Energía',
        comms: 'Comunicaciones',
        ground_station: 'Estación Terrena',
        control_software: 'Sistemas de Control y Software',
        marketing: 'Marketing',
        other: 'Equipo',
      },
    },
    alumni: {
      title: 'Antiguos miembros',
      description:
        'Personas que formaron parte del Málaga Space Team y contribuyeron a que el proyecto llegase hasta aquí.',
      backToTeam: 'Volver al equipo actual',
    },
    join: {
      metaTitle: 'Únete o Colabora',
      degreeOptional: 'Solo si quieres unirte al equipo',
      sending: 'Enviando...',
    },
    social: 'Redes y enlaces',
    inventory: 'Inventario',
    notFound: {
      title: 'Página no encontrada',
      description: 'La página que buscas no existe o se ha movido.',
      back: 'Volver al inicio',
    },
  },
  en: {
    langName: 'English',
    switchTo: 'Español',
    heroTitle: 'The Málaga student team',
    heroTitleMuted: 'for space research',
    stats: { degrees: 'Different degrees', degreesDesc: 'Interdisciplinary team' },
    openMenu: 'Open menu',
    partners: {
      title: 'Sponsors',
      description: 'Companies and organisations that make the project possible through their sponsorship.',
    },
    teamLive: {
      title: 'Who we are',
      description: 'The people behind the project, by working area.',
      alumniLink: 'Former members',
      alumniEmpty: 'No former members have been added yet.',
      departments: {
        professors: 'Faculty',
        management: 'Management and Coordination',
        structure_energy: 'Structure and Power',
        comms: 'Communications',
        ground_station: 'Ground Station',
        control_software: 'Control Systems and Software',
        marketing: 'Marketing',
        other: 'Team',
      },
    },
    alumni: {
      title: 'Former members',
      description: 'People who were part of Málaga Space Team and helped the project get this far.',
      backToTeam: 'Back to the current team',
    },
    join: {
      metaTitle: 'Join or Collaborate',
      degreeOptional: 'Only if you want to join the team',
      sending: 'Sending...',
    },
    social: 'Social links',
    inventory: 'Inventory',
    notFound: {
      title: 'Page not found',
      description: 'The page you are looking for does not exist or has moved.',
      back: 'Back to home',
    },
  },
} as const;

const dictionaries = {
  es: { ...es, extra: extra.es },
  en: { ...en, extra: extra.en },
};

export type Dictionary = (typeof dictionaries)['es'];

// Los JSON heredados llevan emojis en algunos títulos; la web actual no los usa.
const EMOJI = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}]+\s*/gu;
const stripEmoji = <T>(value: T): T => {
  if (typeof value === 'string') return value.replace(EMOJI, '').trim() as T;
  if (Array.isArray(value)) return value.map(stripEmoji) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, stripEmoji(v)])) as T;
  }
  return value;
};

const cleaned = { es: stripEmoji(dictionaries.es), en: stripEmoji(dictionaries.en) };

export const getDictionary = (lang: Lang): Dictionary => cleaned[lang] as Dictionary;

/** Rutas equivalentes en cada idioma (clave = identificador de página). */
export const ROUTES = {
  home: { es: '/', en: '/en' },
  join: { es: '/unete', en: '/en/join' },
  alumni: { es: '/antiguos-miembros', en: '/en/alumni' },
} as const;

export type RouteKey = keyof typeof ROUTES;

export const route = (key: RouteKey, lang: Lang, hash = ''): string => `${ROUTES[key][lang]}${hash}`;

export const otherLang = (lang: Lang): Lang => (lang === 'es' ? 'en' : 'es');

export const HTML_LANG: Record<Lang, string> = { es: 'es', en: 'en' };
export const OG_LOCALE: Record<Lang, string> = { es: 'es_ES', en: 'en_US' };

/** Datos de contacto y redes del equipo (únicos para ambos idiomas). */
export const CONTACT = {
  email: 'spaceteam@uma.es',
  linkedin: 'https://www.linkedin.com/company/malaga-space-team',
  instagram: 'https://www.instagram.com/malagaspaceteam/',
  social: '/social',
};
