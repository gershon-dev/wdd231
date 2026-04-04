// nav.js — hamburger menu + footer year (shared across all pages)
import { setFooterYear } from './utils.js';

let navInitialised = false;

export function initNav() {
  if (navInitialised) return;
  navInitialised = true;

  const btn = document.getElementById('menu-btn');
  const nav = document.getElementById('main-nav');
  if (!btn || !nav) return;

  // Overlay dims page when nav is open — pointer-events:none when closed
  let overlay = document.getElementById('nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'nav-overlay';
    overlay.style.cssText = `
      display: none;
      position: fixed;
      inset: 0;
      top: 57px;
      background: rgba(0,0,0,0.55);
      z-index: 189;
    `;
    document.body.appendChild(overlay);
  }

  function closeNav() {
    nav.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  function openNav() {
    nav.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  btn.addEventListener('click', () => {
    nav.classList.contains('open') ? closeNav() : openNav();
  });

  overlay.addEventListener('click', closeNav);

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) closeNav();
  });
}

// Auto-init for pages that load nav.js directly (form, thankyou)
initNav();
setFooterYear();