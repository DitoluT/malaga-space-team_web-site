// Lógica del panel /admin. La página (src/pages/admin.astro) declara en el HTML qué recursos
// hay y con qué campos; este script los carga, pinta y guarda contra la API (/api/...).
//
// Cada <section data-resource> se configura con data-*:
//   data-endpoint        /api/web/team
//   data-list-path       ruta del listado completo (por defecto `${endpoint}/all`)
//   data-list-key        clave del JSON con la lista (por defecto "data")
//   data-active-field    campo de visible/oculto ("active", "activo" o vacío si no aplica)
//   data-reorder         "true" si se puede ordenar (usa POST `${endpoint}/reorder`)
// Todo lo que llega de la API se inserta con textContent / value, nunca como HTML.

type Item = Record<string, unknown> & { id: number };

class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

const $ = <T extends HTMLElement>(selector: string, root: ParentNode = document) => root.querySelector<T>(selector);
const $$ = <T extends HTMLElement>(selector: string, root: ParentNode = document) => [
  ...root.querySelectorAll<T>(selector),
];

async function api<T = Record<string, unknown>>(
  path: string,
  options: { method?: string; body?: unknown; form?: FormData } = {}
) {
  const { method = 'GET', body, form } = options;
  let response: Response;
  try {
    response = await fetch(path, {
      method,
      credentials: 'include',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: form ?? (body !== undefined ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new ApiError('No se ha podido conectar con el servidor. Revisa tu conexión.', 0);
  }

  let json: Record<string, unknown> = {};
  try {
    json = await response.json();
  } catch {
    /* respuesta sin JSON (p. ej. un 413 de nginx) */
  }

  if (!response.ok) {
    const fallback: Record<number, string> = {
      401: 'Tu sesión ha caducado. Vuelve a iniciar sesión.',
      403: 'No tienes permisos para hacer esto.',
      413: 'El fichero es demasiado grande (máximo 10 MB).',
    };
    throw new ApiError(String(json.error ?? fallback[response.status] ?? `Error ${response.status}`), response.status);
  }
  return json as T;
}

// ---------------------------------------------------------------- avisos

function notify(root: ParentNode, kind: 'success' | 'error', text: string) {
  const box = $('[data-status]', root);
  if (!box) return;
  box.textContent = text;
  box.dataset.kind = kind;
  box.hidden = false;
  if (kind === 'success') window.setTimeout(() => (box.hidden = true), 4000);
}

function handleError(root: ParentNode, error: unknown) {
  const message = error instanceof Error ? error.message : 'Ha ocurrido un error inesperado.';
  notify(root, 'error', message);
  if (error instanceof ApiError && error.status === 401) showView('login');
}

// ---------------------------------------------------------------- sesión y vistas

interface User {
  id: number;
  username: string;
  nombre_completo?: string;
  rol: 'viewer' | 'manager' | 'admin';
  requiere_cambio_password?: boolean | number;
}

let currentUser: User | null = null;

function showView(view: 'loading' | 'login' | 'password' | 'app') {
  $$('[data-view]').forEach((el) => (el.hidden = el.dataset.view !== view));
  $$('[data-when-logged]').forEach((el) => (el.hidden = view !== 'app' && view !== 'password'));
}

function enterApp(user: User, mustChangePassword: boolean) {
  currentUser = user;
  $$('[data-user-name]').forEach((el) => (el.textContent = user.nombre_completo || user.username));
  $$('[data-user-role]').forEach((el) => (el.textContent = user.rol));

  if (mustChangePassword) return showView('password');

  const roles: Record<string, string[]> = { manager: ['manager', 'admin'], admin: ['admin'] };
  $$('[data-requires]').forEach((el) => {
    el.hidden = !roles[el.dataset.requires as string]?.includes(user.rol);
  });
  showView('app');
  const firstTab = $$<HTMLButtonElement>('[data-tab]').find((tab) => !tab.hidden);
  if (firstTab) selectTab(firstTab.dataset.tab as string);
}

async function checkSession() {
  showView('loading');
  try {
    const data = await api<{ user: User }>('/api/inventory/verify');
    enterApp(data.user, Boolean(data.user.requiere_cambio_password));
  } catch {
    showView('login');
  }
}

function initLogin() {
  const form = $<HTMLFormElement>('form[data-login]');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    try {
      const result = await api<{ user: User; requiere_cambio_password: boolean }>('/api/inventory/login', {
        method: 'POST',
        body: { username: data.get('username'), password: data.get('password') },
      });
      form.reset();
      $('[data-status]', form)!.hidden = true;
      enterApp(result.user, Boolean(result.requiere_cambio_password));
    } catch (error) {
      notify(form, 'error', error instanceof Error ? error.message : 'No se ha podido iniciar sesión.');
    }
  });

  $$('[data-logout]').forEach((button) =>
    button.addEventListener('click', async () => {
      await api('/api/inventory/logout', { method: 'POST' }).catch(() => undefined);
      currentUser = null;
      loaded.clear(); // el siguiente usuario vuelve a cargar sus datos
      itemsByResource.clear();
      showView('login');
    })
  );
}

function initPasswordForms() {
  $$<HTMLFormElement>('form[data-change-password]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      if (data.get('new_password') !== data.get('confirm_password')) {
        return notify(form, 'error', 'Las contraseñas nuevas no coinciden.');
      }
      try {
        await api('/api/inventory/change-password', {
          method: 'POST',
          body: { current_password: data.get('current_password'), new_password: data.get('new_password') },
        });
        form.reset();
        if (form.dataset.changePassword === 'forced' && currentUser) return enterApp(currentUser, false);
        notify(form, 'success', 'Contraseña actualizada.');
      } catch (error) {
        handleError(form, error);
      }
    });
  });
}

// ---------------------------------------------------------------- pestañas

const loaded = new Set<string>();

function selectTab(name: string) {
  $$<HTMLButtonElement>('[data-tab]').forEach((tab) =>
    tab.setAttribute('aria-selected', String(tab.dataset.tab === name))
  );
  $$('[data-panel]').forEach((panel) => (panel.hidden = panel.dataset.panel !== name));
  if (loaded.has(name)) return;
  loaded.add(name);
  const resource = $(`[data-panel="${name}"] [data-resource]`);
  if (resource) void loadResource(resource);
  if (name === 'profile') void loadProfile();
}

// ---------------------------------------------------------------- formularios

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function fillForm(form: HTMLFormElement, item: Record<string, unknown>) {
  $$<Control>('[name]', form).forEach((control) => {
    const value = item[control.name];
    if (control instanceof HTMLInputElement && control.type === 'checkbox') {
      control.checked = control.dataset.true !== undefined ? value === control.dataset.true : Boolean(value);
    } else if (control instanceof HTMLInputElement && control.type === 'file') {
      control.value = '';
    } else {
      control.value = value === null || value === undefined ? '' : String(value);
    }
  });
  $$<HTMLImageElement>('[data-upload-preview]', form).forEach((img) => {
    const url = String(item[img.dataset.uploadPreview as string] ?? '');
    img.src = url;
    img.hidden = !url;
  });
}

function readForm(form: HTMLFormElement): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  $$<Control>('[name]', form).forEach((control) => {
    if (control.disabled || control.closest('[hidden]')) return;
    if (control instanceof HTMLInputElement && control.type === 'file') return;
    if (control instanceof HTMLInputElement && control.type === 'checkbox') {
      payload[control.name] =
        control.dataset.true !== undefined
          ? control.checked
            ? control.dataset.true
            : (control.dataset.false ?? '')
          : control.checked;
    } else {
      payload[control.name] = control.value.trim();
    }
  });
  return payload;
}

/** Subida de imágenes: <input type="file" data-upload="logo_url"> rellena el campo de ese nombre. */
function initUploads(form: HTMLFormElement) {
  $$<HTMLInputElement>('input[type="file"][data-upload]', form).forEach((input) => {
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return;
      const data = new FormData();
      data.append('file', file);
      try {
        const result = await api<{ url: string }>('/api/upload', { method: 'POST', form: data });
        const target = $<HTMLInputElement>(`[name="${input.dataset.upload}"]`, form);
        if (target) target.value = result.url;
        const preview = $<HTMLImageElement>(`[data-upload-preview="${input.dataset.upload}"]`, form);
        if (preview) {
          preview.src = result.url;
          preview.hidden = false;
        }
        $('[data-status]', form)!.hidden = true;
      } catch (error) {
        handleError(form, error);
      } finally {
        input.value = '';
      }
    });
  });
}

// ---------------------------------------------------------------- recursos (listas con alta/edición/borrado)

const itemsByResource = new Map<HTMLElement, Item[]>();

async function loadResource(section: HTMLElement) {
  const { endpoint = '', listPath, listKey = 'data' } = section.dataset;
  try {
    const result = await api<Record<string, Item[]>>(listPath ?? `${endpoint}/all`);
    itemsByResource.set(section, result[listKey] ?? []);
    renderResource(section);
  } catch (error) {
    handleError(section, error);
  }
}

function visibleItems(section: HTMLElement): Item[] {
  const items = itemsByResource.get(section) ?? [];
  const filter = $<HTMLSelectElement>('[data-filter]', section);
  if (!filter || filter.value === '') return items;
  const field = filter.dataset.filter as string;
  return items.filter((item) => (filter.value === '__none__' ? !item[field] : item[field] === filter.value));
}

function renderResource(section: HTMLElement) {
  const list = $('[data-list]', section)!;
  const template = $<HTMLTemplateElement>('template[data-row]', section)!;
  const activeField = section.dataset.activeField ?? '';
  const items = visibleItems(section);

  const rows = items.map((item, index) => {
    const row = (template.content.firstElementChild as HTMLElement).cloneNode(true) as HTMLElement;
    row.dataset.id = String(item.id);

    $$('[data-field]', row).forEach((el) => {
      const value = item[el.dataset.field as string];
      if (value === null || value === undefined || value === '') {
        if (el.dataset.optional !== undefined) el.remove();
        else el.textContent = el.dataset.empty ?? '';
      } else {
        el.textContent = String(value);
      }
    });

    $$<HTMLImageElement>('img[data-image]', row).forEach((img) => {
      const url = String(item[img.dataset.image as string] ?? '');
      if (url.startsWith('/') || /^https?:\/\//i.test(url)) {
        img.src = url;
        img.alt = String(item.name ?? '');
      } else {
        img.remove();
      }
    });

    // Edición directa en la fila: se guarda al cambiar
    $$<Control>('[data-inline]', row).forEach((control) => {
      const field = control.dataset.inline as string;
      control.value = item[field] === null || item[field] === undefined ? '' : String(item[field]);
      control.addEventListener('change', async () => {
        try {
          await api(`${section.dataset.endpoint}/${item.id}`, {
            method: 'PUT',
            body: { [field]: control.value.trim() },
          });
          item[field] = control.value.trim() || null;
          notify(section, 'success', `Guardado: ${String(item.name ?? item.nombre_completo ?? '')}`);
        } catch (error) {
          handleError(section, error);
        }
      });
    });

    const isActive = activeField ? Boolean(item[activeField]) : true;
    row.dataset.inactive = String(!isActive);
    $$('[data-badge="hidden"]', row).forEach((badge) => (badge.hidden = isActive));
    $$('[data-badge-if]', row).forEach((badge) => {
      const [field, expected] = (badge.dataset.badgeIf as string).split('=');
      badge.hidden = String(item[field] ?? '') !== expected;
    });

    const toggle = $<HTMLButtonElement>('[data-action="toggle"]', row);
    if (toggle)
      toggle.textContent = isActive ? (toggle.dataset.labelHide ?? 'Ocultar') : (toggle.dataset.labelShow ?? 'Mostrar');
    const up = $<HTMLButtonElement>('[data-action="up"]', row);
    const down = $<HTMLButtonElement>('[data-action="down"]', row);
    if (up) up.disabled = index === 0;
    if (down) down.disabled = index === items.length - 1;
    if (currentUser && item.id === currentUser.id) $$('[data-not-self]', row).forEach((el) => el.remove());

    return row;
  });

  list.replaceChildren(...rows);
  $('[data-empty]', section)!.hidden = rows.length > 0;
  const count = $('[data-count]', section);
  if (count) count.textContent = String(items.length);
}

/** <select data-options="/api/..." data-options-key="users" data-option-label="a,b"> se rellena una vez desde la API. */
async function loadSelectOptions(form: HTMLFormElement) {
  for (const select of $$<HTMLSelectElement>('select[data-options]', form)) {
    if (select.dataset.optionsLoaded || select.closest('[hidden]')) continue;
    select.dataset.optionsLoaded = 'true';
    const result = await api<Record<string, Item[]>>(select.dataset.options as string);
    const labelFields = (select.dataset.optionLabel ?? 'name').split(',');
    for (const entry of result[select.dataset.optionsKey ?? 'data'] ?? []) {
      const option = document.createElement('option');
      option.value = String(entry.id);
      option.textContent = labelFields
        .map((field) => entry[field])
        .filter(Boolean)
        .join(' · ');
      select.append(option);
    }
  }
}

async function openDialog(section: HTMLElement, item: Item | null) {
  const dialog = $<HTMLDialogElement>('dialog[data-dialog]', section)!;
  const form = $<HTMLFormElement>('form', dialog)!;
  await loadSelectOptions(form).catch((error) => handleError(section, error));
  form.reset();
  form.dataset.id = item ? String(item.id) : '';
  $$('[data-only]', form).forEach((el) => (el.hidden = el.dataset.only !== (item ? 'edit' : 'create')));
  $$('[data-dialog-title]', dialog).forEach((el) => {
    el.textContent = (item ? el.dataset.titleEdit : el.dataset.titleCreate) ?? '';
  });
  fillForm(form, item ?? {});
  $('[data-status]', form)!.hidden = true;
  $('[data-secret]', form)?.setAttribute('hidden', '');
  dialog.showModal();
}

function showSecret(root: ParentNode, password: string) {
  const box = $('[data-secret]', root);
  if (!box) return;
  $('[data-secret-value]', box)!.textContent = password;
  box.hidden = false;
}

function initResource(section: HTMLElement) {
  const endpoint = section.dataset.endpoint as string;
  const activeField = section.dataset.activeField ?? '';
  const dialog = $<HTMLDialogElement>('dialog[data-dialog]', section)!;
  const form = $<HTMLFormElement>('form', dialog)!;
  initUploads(form);

  $('[data-add]', section)?.addEventListener('click', () => void openDialog(section, null));
  $$('[data-close]', dialog).forEach((button) => button.addEventListener('click', () => dialog.close()));
  $('[data-filter]', section)?.addEventListener('change', () => renderResource(section));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = form.dataset.id;
    try {
      const result = await api<{ temp_password?: string }>(id ? `${endpoint}/${id}` : endpoint, {
        method: id ? 'PUT' : 'POST',
        body: readForm(form),
      });
      await loadResource(section);
      if (result.temp_password) {
        // Se muestra la primera contraseña: el diálogo sigue abierto para poder copiarla
        showSecret(form, result.temp_password);
        notify(form, 'success', 'Guardado.');
      } else {
        dialog.close();
        notify(section, 'success', 'Guardado. Ya está visible en la web.');
      }
    } catch (error) {
      handleError(form, error);
    }
  });

  $('[data-reset-password]', form)?.addEventListener('click', async () => {
    if (!form.dataset.id || !window.confirm('¿Restablecer la contraseña de este usuario a la primera contraseña del equipo?')) return;
    try {
      const result = await api<{ temp_password?: string }>(`${endpoint}/${form.dataset.id}`, {
        method: 'PUT',
        body: { reset_password: true },
      });
      if (result.temp_password) showSecret(form, result.temp_password);
    } catch (error) {
      handleError(form, error);
    }
  });

  $('[data-list]', section)!.addEventListener('click', async (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-action]');
    const row = button?.closest<HTMLElement>('[data-id]');
    if (!button || !row) return;
    const items = itemsByResource.get(section) ?? [];
    const item = items.find((candidate) => candidate.id === Number(row.dataset.id));
    if (!item) return;

    try {
      switch (button.dataset.action) {
        case 'edit':
          return void openDialog(section, item);
        case 'delete': {
          const label = String(item.name ?? item.nombre_completo ?? 'este elemento');
          if (!window.confirm(`¿Eliminar «${label}»? Esta acción no se puede deshacer.`)) return;
          await api(`${endpoint}/${item.id}`, { method: 'DELETE' });
          notify(section, 'success', `Eliminado: ${label}`);
          break;
        }
        case 'toggle':
          await api(`${endpoint}/${item.id}`, { method: 'PUT', body: { [activeField]: item[activeField] ? 0 : 1 } });
          break;
        case 'up':
        case 'down': {
          // Se intercambia con el vecino visible (respeta el filtro) y se renumera la lista entera
          const visible = visibleItems(section);
          const position = visible.indexOf(item);
          const neighbour = visible[position + (button.dataset.action === 'up' ? -1 : 1)];
          if (!neighbour) return;
          const a = items.indexOf(item);
          const b = items.indexOf(neighbour);
          [items[a], items[b]] = [items[b], items[a]];
          await api(`${endpoint}/reorder`, { method: 'POST', body: { ids: items.map((entry) => entry.id) } });
          break;
        }
        default:
          return;
      }
      await loadResource(section);
    } catch (error) {
      handleError(section, error);
    }
  });
}

// ---------------------------------------------------------------- mi perfil

async function loadProfile() {
  const form = $<HTMLFormElement>('form[data-my-member]');
  if (!form) return;
  try {
    const result = await api<{ success: boolean; data?: Item }>('/api/web/team/me');
    form.hidden = !result.success;
    $('[data-no-member]')!.hidden = result.success;
    if (result.success && result.data) {
      form.dataset.id = String(result.data.id);
      fillForm(form, result.data);
      $('[data-member-name]', form)!.textContent = String(result.data.name ?? '');
    }
  } catch (error) {
    handleError(form, error);
  }
}

function initProfile() {
  const form = $<HTMLFormElement>('form[data-my-member]');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      await api(`/api/web/team/${form.dataset.id}`, { method: 'PUT', body: readForm(form) });
      notify(form, 'success', 'Ficha actualizada.');
    } catch (error) {
      handleError(form, error);
    }
  });
}

// ---------------------------------------------------------------- arranque

function init() {
  if (!$('[data-admin]') || document.documentElement.dataset.adminReady) return;
  document.documentElement.dataset.adminReady = 'true';

  initLogin();
  initPasswordForms();
  initProfile();
  $$('[data-resource]').forEach(initResource);
  $$<HTMLButtonElement>('[data-tab]').forEach((tab) =>
    tab.addEventListener('click', () => selectTab(tab.dataset.tab as string))
  );
  $$('[data-copy]').forEach((button) =>
    button.addEventListener('click', () => {
      const value = button.closest('[data-secret]')?.querySelector('[data-secret-value]')?.textContent ?? '';
      void navigator.clipboard?.writeText(value);
    })
  );
  void checkSession();
}

document.addEventListener('astro:page-load', init);
