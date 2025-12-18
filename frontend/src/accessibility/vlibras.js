export function initVlibras() {
  // VLibras is loaded via script tag in index.html
  if (window?.VLibras?.Widget) {
    new window.VLibras.Widget('https://vlibras.gov.br/app');
  }
}
