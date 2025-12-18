import './register.css';
import registerHtml from './register.html?raw';
import { apiRegister } from '../../services/api.js';

function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.setAttribute('aria-live', isError ? 'assertive' : 'polite');
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2600);
}

export function renderRegister(mountId = 'main') {
  const el = document.getElementById(mountId);
  if (!el) return;
  el.innerHTML = registerHtml;

  el.querySelector('#go-login')?.addEventListener('click', () => {
    window.location.hash = '#/login';
  });

  el.querySelector('#register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = el.querySelector('#reg-name')?.value?.trim();
    const email = el.querySelector('#reg-email')?.value?.trim();
    const password = el.querySelector('#reg-password')?.value;

    try {
      await apiRegister({ name, email, password });
      showToast('Conta criada. Faça login.');
      window.location.hash = '#/login';
    } catch (err) {
      showToast(err.message || 'Falha no cadastro.', true);
    }
  });

  el.querySelector('#reg-name')?.focus();
}
