// favourites.js — favourites page (favourites.html)
import { initNav } from './nav.js';
import { setFooterYear, posterUrl, formatRating, releaseYear, getGenreNames } from './utils.js';
import { getFavourites, removeFavourite, clearFavourites } from './storage.js';
import { openMovieModal } from './modal.js';

initNav();
setFooterYear();

// ── Build favourite card ──────────────────────────────
function buildFavCard(movie, index = 0) {
  const genres = getGenreNames(movie.genre_ids || []);

  const article = document.createElement('article');
  article.className = 'movie-card';
  article.setAttribute('role', 'button');
  article.setAttribute('tabindex', '0');
  article.setAttribute('aria-label', `${movie.title}, click for details`);
  article.style.animationDelay = `${index * 0.06}s`;
  article.dataset.id = movie.id;

  article.innerHTML = `
    <div class="movie-card__poster">
      <img
        src="${posterUrl(movie.poster_path)}"
        alt="${movie.title} poster"
        loading="lazy"
        width="342" height="513"
      >
      <span class="movie-card__rating">${formatRating(movie.vote_average)}</span>
      <button
        class="movie-card__fav active"
        data-id="${movie.id}"
        aria-label="Remove from favourites"
        aria-pressed="true"
      >♥</button>
    </div>
    <div class="movie-card__body">
      <h3 class="movie-card__title">${movie.title}</h3>
      <div class="movie-card__meta">
        <span>${releaseYear(movie.release_date)}</span>
        ${genres.map(g => `<span class="movie-card__genre">${g}</span>`).join('')}
      </div>
    </div>
  `;

  // Open modal
  article.addEventListener('click', (e) => {
    if (!e.target.closest('.movie-card__fav')) openMovieModal(movie);
  });
  article.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.target.closest('.movie-card__fav')) openMovieModal(movie);
  });

  // Remove from favourites
  article.querySelector('.movie-card__fav').addEventListener('click', (e) => {
    e.stopPropagation();
    removeFavourite(movie.id);
    article.remove();
    updateCount();
    showEmptyIfNeeded();
  });

  return article;
}

// ── Update count display ──────────────────────────────
function updateCount() {
  const favs   = getFavourites();
  const countEl = document.getElementById('favs-count');
  if (countEl) countEl.textContent = `${favs.length} saved film${favs.length !== 1 ? 's' : ''}`;
}

// ── Show empty state ──────────────────────────────────
function showEmptyIfNeeded() {
  const grid   = document.getElementById('favs-grid');
  const favs   = getFavourites();
  const clearBtn = document.getElementById('clear-all-btn');
  if (clearBtn) clearBtn.hidden = favs.length === 0;

  if (favs.length === 0 && grid) {
    grid.innerHTML = `
      <div class="error-msg" style="grid-column:1/-1">
        <p>No favourites saved yet.</p>
        <a href="movies.html" class="btn btn--primary" style="margin-top:1rem">Browse Movies →</a>
      </div>
    `;
  }
}

// ── Render all favourites ─────────────────────────────
function renderFavourites() {
  const grid = document.getElementById('favs-grid');
  if (!grid) return;

  const favs = getFavourites();
  grid.innerHTML = '';

  if (favs.length === 0) {
    showEmptyIfNeeded();
    updateCount();
    return;
  }

  // filter() demo — could filter by genre; here we just ensure valid entries
  const valid = favs.filter(m => m && m.id);

  // Use forEach to render cards
  valid.forEach((movie, i) => {
    grid.appendChild(buildFavCard(movie, i));
  });

  updateCount();

  const clearBtn = document.getElementById('clear-all-btn');
  if (clearBtn) clearBtn.hidden = false;
}

// ── Clear all ─────────────────────────────────────────
document.getElementById('clear-all-btn')?.addEventListener('click', () => {
  if (confirm('Remove all saved favourites?')) {
    clearFavourites();
    renderFavourites();
  }
});

// ── Init ──────────────────────────────────────────────
renderFavourites();
