// nav.js — hamburger menu + footer year (shared across all pages)
import { setFooterYear } from './utils.js';

export function initNav() {
  const btn = document.getElementById('menu-btn');
  const nav = document.getElementById('main-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav when a link is clicked (mobile)
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

// Auto-init when this module is loaded directly (form/thankyou/attributions pages)
initNav();
setFooterYear();
