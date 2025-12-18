import './login.css';
import loginHtml from './login.html?raw';
import { apiLogin } from '../../services/api.js';
import { setSession } from '../../state/session.js';

function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.setAttribute('aria-live', isError ? 'assertive' : 'polite');
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2600);
}

export function renderLogin(mountId = 'main') {
  const el = document.getElementById(mountId);
  if (!el) return;
  el.innerHTML = loginHtml;

  el.querySelector('#go-register')?.addEventListener('click', () => {
    window.location.hash = '#/register';
  });

  el.querySelector('#login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = el.querySelector('#login-email')?.value?.trim();
    const password = el.querySelector('#login-password')?.value;

    try {
      const data = await apiLogin({ email, password });
      setSession(data.token, data.user);
      showToast('Login realizado.');
      window.location.hash = '#/dashboard';
    } catch (err) {
      showToast(err.message || 'Falha no login.', true);
    }
  });

  el.querySelector('#login-email')?.focus();
}
