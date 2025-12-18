import './footer.css';
import footerHtml from './footer.html?raw';

export function renderFooter(mountId = 'footer') {
  const el = document.getElementById(mountId);
  if (!el) return;
  el.innerHTML = footerHtml;
}
