import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '~/config/emailjs';
import { onPageLoad } from '~/scripts/live';

// Formularios con [data-email-form]. Mensajes y validaciones llegan por data-*.
// Un <input name="subject"> / <textarea name="message"> pueden generarse a partir de otros
// campos con data-compose (ver JoinForm.astro).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setStatus(form: HTMLFormElement, kind: 'success' | 'error' | 'info', text: string) {
  const box = form.querySelector<HTMLElement>('[data-form-status]');
  if (!box) return;
  box.textContent = text;
  box.dataset.kind = kind;
  box.hidden = false;
}

function initForm(form: HTMLFormElement) {
  if (form.dataset.bound) return;
  form.dataset.bound = 'true';
  const msg = form.dataset;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const buttonLabel = button?.textContent ?? '';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const compose = (form as HTMLFormElement & { composeEmail?: () => string | null }).composeEmail;
    if (compose) {
      const problem = compose();
      if (problem) return setStatus(form, 'error', problem);
    }

    const data = new FormData(form);
    const required = ['name', 'email', 'subject', 'message'];
    if (required.some((field) => !String(data.get(field) ?? '').trim())) {
      return setStatus(form, 'error', msg.msgRequired ?? '');
    }
    if (!EMAIL_RE.test(String(data.get('email')))) {
      return setStatus(form, 'error', msg.msgInvalidEmail ?? '');
    }

    if (button) {
      button.disabled = true;
      button.textContent = msg.msgLoading ?? buttonLabel;
    }
    try {
      const result = await emailjs.sendForm(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, form, {
        publicKey: EMAILJS_CONFIG.publicKey,
      });
      if (result.status !== 200) throw new Error(String(result.status));
      form.reset();
      setStatus(form, 'success', msg.msgSuccess ?? '');
    } catch {
      setStatus(form, 'error', msg.msgError ?? '');
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = buttonLabel;
      }
    }
  });
}

onPageLoad(() => document.querySelectorAll<HTMLFormElement>('form[data-email-form]').forEach(initForm));
