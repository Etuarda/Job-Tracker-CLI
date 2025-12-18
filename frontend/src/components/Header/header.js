import './header.css';
import headerHtml from './header.html?raw';
import { logout } from '../../state/session.js';

export function renderHeader(mountId = 'header') {
  const el = document.getElementById(mountId);
  if (!el) return;

  el.innerHTML = headerHtml;

  const logoutBtn = el.querySelector('#logout-btn');
  logoutBtn?.addEventListener('click', () => {
    logout();
    window.location.hash = '#/login';
  });
}
