import './styles/global.css';
import { initVlibras } from './accessibility/vlibras.js';
import { renderHeader } from './components/Header/header.js';
import { renderFooter } from './components/Footer/footer.js';
import { renderLogin } from './pages/Login/login.js';
import { renderRegister } from './pages/Register/register.js';
import { renderDashboard } from './pages/Dashboard/dashboard.js';
import { isAuthenticated } from './state/session.js';

function renderShell() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div id="header"></div>
    <main id="main" class="container" tabindex="-1"></main>
    <div id="footer"></div>
  `;
  renderFooter();
}

function route() {
  const hash = window.location.hash || '';
  const main = document.getElementById('main');

  // Hide header in auth screens
  const headerMount = document.getElementById('header');

  const isAuthRoute = hash.startsWith('#/login') || hash.startsWith('#/register') || hash === '' || hash === '#';
  headerMount.innerHTML = '';

  if (!hash || hash === '#' || hash === '#/') {
    window.location.hash = isAuthenticated() ? '#/dashboard' : '#/login';
    return;
  }

  if (hash.startsWith('#/login')) {
    renderLogin('main');
    main?.focus();
    return;
  }

  if (hash.startsWith('#/register')) {
    renderRegister('main');
    main?.focus();
    return;
  }

  if (hash.startsWith('#/dashboard')) {
    renderHeader('header');
    renderDashboard('main');
    main?.focus();
    return;
  }

  // fallback
  window.location.hash = isAuthenticated() ? '#/dashboard' : '#/login';
}

document.addEventListener('DOMContentLoaded', () => {
  renderShell();
  initVlibras();
  route();
});

window.addEventListener('hashchange', route);
