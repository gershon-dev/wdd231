// modal.js — accessible modal dialog

import { fetchMovieDetails } from './api.js';
import { backdropUrl, posterUrl, formatRating, releaseYear, getGenreNames } from './utils.js';
import { addFavourite, removeFavourite, isFavourite } from './storage.js';

const modal      = document.getElementById('movie-modal');
const modalClose = document.getElementById('modal-close');
const modalContent = document.getElementById('modal-content');
const backdrop   = modal?.querySelector('.modal__backdrop');

let lastFocused = null; // for returning focus on close

export function openModal(movie) {
  if (!modal) return;
  lastFocused = document.activeElement;

  renderModal(movie);

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modalClose?.focus();
}

export function closeModal() {
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = '';
  lastFocused?.focus();
}

function renderModal(movie) {
  const genres = getGenreNames(movie.genre_ids || []);
  const genreStr = genres.length ? genres.join(' · ') : 'Film';
  const favActive = isFavourite(movie.id) ? 'active' : '';
  const favLabel  = isFavourite(movie.id) ? 'Remove from favourites' : 'Add to favourites';
  const favText   = isFavourite(movie.id) ? '♥ Saved' : '♡ Save';

  modalContent.innerHTML = `
    <img
      class="modal-poster"
      src="${backdropUrl(movie.backdrop_path || movie.poster_path)}"
      alt="${movie.title} backdrop"
      loading="lazy"
    >
    <div class="modal-body">
      <h2 id="modal-title" class="modal-title">${movie.title}</h2>
      ${movie.tagline ? `<p class="modal-tagline">"${movie.tagline}"</p>` : ''}
      <div class="modal-meta">
        <span class="modal-tag modal-tag--highlight">${formatRating(movie.vote_average)}</span>
        <span class="modal-tag">${releaseYear(movie.release_date)}</span>
        ${genres.map(g => `<span class="modal-tag">${g}</span>`).join('')}
        ${movie.runtime ? `<span class="modal-tag">${movie.runtime} min</span>` : ''}
      </div>
      <p class="modal-overview">${movie.overview || 'No overview available.'}</p>
      <div class="modal-actions">
        <button
          class="btn btn--primary fav-toggle-btn ${favActive}"
          data-id="${movie.id}"
          aria-label="${favLabel}"
        >${favText}</button>
        <button class="btn btn--ghost" id="modal-close-btn">Close</button>
      </div>
    </div>
  `;

  // Fav toggle inside modal
  modalContent.querySelector('.fav-toggle-btn')?.addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const id = Number(btn.dataset.id);
    if (isFavourite(id)) {
      removeFavourite(id);
      btn.textContent = '♡ Save';
      btn.classList.remove('active');
      btn.setAttribute('aria-label', 'Add to favourites');
    } else {
      addFavourite(movie);
      btn.textContent = '♥ Saved';
      btn.classList.add('active');
      btn.setAttribute('aria-label', 'Remove from favourites');
    }
  });

  document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
}

// Open modal with full details fetched
export async function openMovieModal(movie) {
  // Show basic info immediately, then enrich with full details
  openModal(movie);

  const details = await fetchMovieDetails(movie.id);
  if (details) openModal({ ...movie, ...details });
}

// ── Event listeners ───────────────────────────────────
modalClose?.addEventListener('click', closeModal);
backdrop?.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
});
