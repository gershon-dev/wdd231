// discover.js — Build place cards, grid-area layout, visitor message
// type="module" required in HTML so we can use import

import { places } from '../data/places.mjs';

// ── Footer dynamic dates ────────────────────────────────
const yearEl     = document.getElementById('current-year');
const modifiedEl = document.getElementById('last-modified');
if (yearEl)     yearEl.textContent = new Date().getFullYear();
if (modifiedEl) modifiedEl.textContent = `Last Modified: ${document.lastModified}`;

// ── Build a single place card ───────────────────────────
function buildCard(place, index) {
  const article = document.createElement('article');
  article.className = 'place-card';

  // Named grid area used by CSS grid-template-areas
  article.style.gridArea = `place-${place.id}`;

  // data-id enables reliable CSS attribute targeting
  article.dataset.id = String(place.id);

  article.setAttribute('aria-label', place.name);
  article.style.animationDelay = `${index * 0.07}s`;

  // Build figure + img without innerHTML to avoid inline event handler violation
  const figure = document.createElement('figure');
  figure.className = 'place-card__fig';

  const img = document.createElement('img');
  img.src     = place.image;
  img.alt     = place.alt;
  img.loading = 'lazy';
  img.width   = 300;
  img.height  = 200;
  img.addEventListener('error', () => {
    img.src = 'images/placeholder.webp';
    img.alt = 'Location photo unavailable';
  });
  figure.appendChild(img);

  // Build card body using DOM methods (no inline handlers)
  const body = document.createElement('div');
  body.className = 'place-card__body';

  const heading = document.createElement('h2');
  heading.className   = 'place-card__name';
  heading.textContent = place.name;

  const address = document.createElement('address');
  address.className   = 'place-card__address';
  address.textContent = place.address;

  const desc = document.createElement('p');
  desc.className   = 'place-card__desc';
  desc.textContent = place.description;

  const btn = document.createElement('button');
  btn.className = 'place-card__btn';
  btn.setAttribute('aria-label', `Learn more about ${place.name}`);
  // SVG is decorative — safe to use innerHTML only for the icon
  btn.innerHTML = `Learn More <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

  body.appendChild(heading);
  body.appendChild(address);
  body.appendChild(desc);
  body.appendChild(btn);

  article.appendChild(figure);
  article.appendChild(body);

  return article;
}

// ── Render all cards ────────────────────────────────────
const grid = document.getElementById('places-grid');
if (grid) {
  places.forEach((place, i) => grid.appendChild(buildCard(place, i)));
}

// ── Visitor message via localStorage ───────────────────
function showVisitorMessage() {
  const msgEl   = document.getElementById('visitor-msg');
  const closeBtn = document.getElementById('visitor-close');
  if (!msgEl) return;

  const STORAGE_KEY = 'chamber-discover-last-visit';
  const now         = Date.now();
  const lastVisit   = localStorage.getItem(STORAGE_KEY);

  let message = '';

  if (!lastVisit) {
    // First visit ever
    message = 'Welcome! Let us know if you have any questions.';
  } else {
    const diffMs   = now - parseInt(lastVisit, 10);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      message = 'Back so soon! Awesome!';
    } else if (diffDays === 1) {
      message = 'You last visited 1 day ago.';
    } else {
      message = `You last visited ${diffDays} days ago.`;
    }
  }

  // Always update the stored date AFTER reading it
  localStorage.setItem(STORAGE_KEY, now.toString());

  // Show message using class toggle (CSS display:flex overrides [hidden] attr)
  const textEl = msgEl.querySelector('.visitor-msg__text');
  if (textEl) textEl.textContent = message;
  msgEl.classList.add('visitor-msg--visible');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      msgEl.classList.remove('visitor-msg--visible');
    });
  }
}

showVisitorMessage();
