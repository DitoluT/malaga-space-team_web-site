// Utilidades para las secciones que leen contenido de la API (/api/web/*), editable desde /admin.
// Todo lo que llega de la API se inserta con textContent / atributos validados, nunca como HTML.

export interface ApiList<T> {
  success: boolean;
  data: T[];
}

export async function fetchList<T>(endpoint: string): Promise<T[]> {
  try {
    const res = await fetch(endpoint, { headers: { Accept: 'application/json' } });
    if (!res.ok) return [];
    const json = (await res.json()) as ApiList<T>;
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

/** Solo http(s), mailto o rutas relativas del propio sitio. */
export function safeUrl(value: unknown, { allowMailto = false } = {}): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const v = value.trim();
  if (v.startsWith('/') && !v.startsWith('//')) return v;
  try {
    const url = new URL(v);
    if (url.protocol === 'http:' || url.protocol === 'https:') return url.href;
    if (allowMailto && url.protocol === 'mailto:') return url.href;
  } catch {
    /* no es una URL válida */
  }
  return null;
}

/** Clona un <template> y rellena sus [data-field] con texto. */
export function fillTemplate(template: HTMLTemplateElement, fields: Record<string, unknown>): HTMLElement {
  const node = (template.content.firstElementChild as HTMLElement).cloneNode(true) as HTMLElement;
  node.querySelectorAll<HTMLElement>('[data-field]').forEach((el) => {
    const value = fields[el.dataset.field as string];
    if (value === undefined || value === null || value === '') {
      if (el.dataset.optional !== undefined) el.remove();
      return;
    }
    el.textContent = String(value);
  });
  return node;
}

/** Ejecuta `init` en cada carga de página (compatible con las View Transitions de Astro). */
export function onPageLoad(init: () => void): void {
  document.addEventListener('astro:page-load', init);
}

/** Devuelve la versión en inglés de un campo (`campo_en`) si la página está en inglés y existe. */
export function localized<T extends Record<string, unknown>>(item: T, field: string): unknown {
  const english = document.documentElement.lang === 'en' ? item[`${field}_en`] : null;
  return english || item[field];
}
