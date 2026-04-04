// movies.js — browse & filter page (movies.html)
import { initNav } from './nav.js';
import { setFooterYear, posterUrl, formatRating, releaseYear, getGenreNames } from './utils.js';
import { fetchDiscover } from './api.js';
import { addFavourite, removeFavourite, isFavourite } from './storage.js';
import { openMovieModal } from './modal.js';

initNav();
setFooterYear();

// ── State ─────────────────────────────────────────────
let currentPage   = 1;
let currentGenre  = '';
let currentSort   = 'popularity.desc';
let allMovies     = [];
let totalResults  = 0;

// ── Save filter preferences to localStorage ──────────
function savePrefs() {
  localStorage.setItem('cinescope_prefs', JSON.stringify({ genre: currentGenre, sort: currentSort }));
}
function loadPrefs() {
  try {
    const raw = localStorage.getItem('cinescope_prefs');
    if (!raw) return;
    const prefs = JSON.parse(raw);
    currentGenre = prefs.genre || '';
    currentSort  = prefs.sort  || 'popularity.desc';
  } catch { /* ignore */ }
}

// ── Build card ────────────────────────────────────────
function buildCard(movie, index = 0) {
  const genres = getGenreNames(movie.genre_ids || []);
  const favActive = isFavourite(movie.id) ? 'active' : '';

  const article = document.createElement('article');
  article.className = 'movie-card';
  article.setAttribute('role', 'button');
  article.setAttribute('tabindex', '0');
  article.setAttribute('aria-label', `${movie.title}, ${releaseYear(movie.release_date)}`);
  article.style.animationDelay = `${index * 0.05}s`;

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
        class="movie-card__fav ${favActive}"
        data-id="${movie.id}"
        aria-label="${favActive ? 'Remove from favourites' : 'Add to favourites'}"
        aria-pressed="${!!favActive}"
      >${favActive ? '♥' : '♡'}</button>
    </div>
    <div class="movie-card__body">
      <h3 class="movie-card__title">${movie.title}</h3>
      <div class="movie-card__meta">
        <span>${releaseYear(movie.release_date)}</span>
        ${genres.map(g => `<span class="movie-card__genre">${g}</span>`).join('')}
      </div>
    </div>
  `;

  article.addEventListener('click', (e) => {
    if (!e.target.closest('.movie-card__fav')) openMovieModal(movie);
  });
  article.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.target.closest('.movie-card__fav')) openMovieModal(movie);
  });

  article.querySelector('.movie-card__fav').addEventListener('click', (e) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    const id  = Number(btn.dataset.id);
    if (isFavourite(id)) {
      removeFavourite(id);
      btn.textContent = '♡'; btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    } else {
      addFavourite(movie);
      btn.textContent = '♥'; btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    }
  });

  return article;
}

// ── Render movies ─────────────────────────────────────
function renderMovies(movies, append = false) {
  const grid = document.getElementById('movies-grid');
  if (!grid) return;

  if (!append) grid.innerHTML = '';

  if (!movies.length && !append) {
    grid.innerHTML = '<p class="error-msg">No movies found for this filter.</p>';
    return;
  }

  // Use map() then forEach — demonstrates both array methods
  const cards = movies.map((movie, i) => buildCard(movie, append ? allMovies.length - movies.length + i : i));
  cards.forEach(card => grid.appendChild(card));

  // Update results count
  const countEl = document.getElementById('results-count');
  if (countEl) countEl.textContent = `${allMovies.length} of ${totalResults.toLocaleString()} films`;
}

// ── Fetch and display ─────────────────────────────────
async function loadMovies(append = false) {
  const grid     = document.getElementById('movies-grid');
  const loadMore = document.getElementById('load-more');

  if (!append && grid) grid.innerHTML = '<p class="loading-msg" role="status">Loading movies…</p>';
  if (loadMore) loadMore.disabled = true;

  const data = await fetchDiscover({
    genreId: currentGenre,
    sortBy:  currentSort,
    page:    currentPage
  });

  if (!data?.results) {
    if (grid) grid.innerHTML = '<p class="error-msg">Failed to load movies. Please check your API key in api.js.</p>';
    return;
  }

  totalResults = data.total_results;

  if (append) {
    allMovies = [...allMovies, ...data.results];
  } else {
    allMovies = data.results;
  }

  renderMovies(data.results, append);

  // Show/hide load more
  const hasMore = currentPage < data.total_pages && allMovies.length < totalResults;
  const paginationEl = document.getElementById('pagination');
  if (paginationEl) paginationEl.style.display = hasMore ? 'block' : 'none';
  if (loadMore) loadMore.disabled = false;
}

// ── Controls ──────────────────────────────────────────
function initControls() {
  const genreFilter = document.getElementById('genre-filter');
  const sortSelect  = document.getElementById('sort-select');
  const loadMoreBtn = document.getElementById('load-more');

  // Restore saved prefs
  loadPrefs();
  if (genreFilter) genreFilter.value = currentGenre;
  if (sortSelect)  sortSelect.value  = currentSort;

  genreFilter?.addEventListener('change', () => {
    currentGenre = genreFilter.value;
    currentPage  = 1;
    allMovies    = [];
    savePrefs();
    loadMovies();
  });

  sortSelect?.addEventListener('change', () => {
    currentSort = sortSelect.value;
    currentPage = 1;
    allMovies   = [];
    savePrefs();
    loadMovies();
  });

  loadMoreBtn?.addEventListener('click', () => {
    currentPage++;
    loadMovies(true);
  });
}

// ── Init ──────────────────────────────────────────────
initControls();
loadMovies();
