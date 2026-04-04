// main.js — home page (index.html)
import { initNav } from './nav.js';
import { fetchPopular, fetchTopRated } from './api.js';
import { posterUrl, formatRating, releaseYear, getGenreNames, setFooterYear } from './utils.js';
import { addFavourite, removeFavourite, isFavourite, getFavCount } from './storage.js';
import { openMovieModal } from './modal.js';

initNav();
setFooterYear();

// ── Build a movie card ────────────────────────────────
function buildCard(movie) {
  const genres = getGenreNames(movie.genre_ids || []);
  const favActive = isFavourite(movie.id) ? 'active' : '';

  const article = document.createElement('article');
  article.className = 'movie-card';
  article.setAttribute('role', 'button');
  article.setAttribute('tabindex', '0');
  article.setAttribute('aria-label', `${movie.title}, rated ${formatRating(movie.vote_average)}`);

  article.innerHTML = `
    <div class="movie-card__poster">
      <img
        src="${posterUrl(movie.poster_path)}"
        alt="${movie.title} poster"
        loading="lazy"
        width="342" height="513"
      >
      <span class="movie-card__rating" aria-label="Rating: ${formatRating(movie.vote_average)}">
        ${formatRating(movie.vote_average)}
      </span>
      <button
        class="movie-card__fav ${favActive}"
        data-id="${movie.id}"
        aria-label="${isFavourite(movie.id) ? 'Remove from favourites' : 'Add to favourites'}"
        aria-pressed="${isFavourite(movie.id)}"
      >${isFavourite(movie.id) ? '♥' : '♡'}</button>
    </div>
    <div class="movie-card__body">
      <h3 class="movie-card__title">${movie.title}</h3>
      <div class="movie-card__meta">
        <span>${releaseYear(movie.release_date)}</span>
        ${genres.map(g => `<span class="movie-card__genre">${g}</span>`).join('')}
      </div>
    </div>
  `;

  // Open modal on click / enter
  article.addEventListener('click', (e) => {
    if (!e.target.closest('.movie-card__fav')) openMovieModal(movie);
  });
  article.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.target.closest('.movie-card__fav')) openMovieModal(movie);
  });

  // Favourite toggle
  article.querySelector('.movie-card__fav').addEventListener('click', (e) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    const id = Number(btn.dataset.id);
    if (isFavourite(id)) {
      removeFavourite(id);
      btn.textContent = '♡';
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', 'Add to favourites');
    } else {
      addFavourite(movie);
      btn.textContent = '♥';
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      btn.setAttribute('aria-label', 'Remove from favourites');
    }
    // Update fav stat
    updateFavStat();
  });

  return article;
}

// ── Render movies into a grid ─────────────────────────
function renderGrid(containerId, movies) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = '';
  // Use forEach array method to process each movie
  movies.forEach((movie, index) => {
    const card = buildCard(movie);
    card.style.animationDelay = `${index * 0.06}s`;
    grid.appendChild(card);
  });
}

// ── Update stats ──────────────────────────────────────
function updateFavStat() {
  const el = document.getElementById('stat-favs');
  if (el) el.textContent = getFavCount();
}

// ── Load home sections ────────────────────────────────
async function loadHome() {
  // Trending (popular)
  const trendingGrid = document.getElementById('trending-grid');
  const popularData = await fetchPopular(1);

  if (popularData?.results) {
    // Use .slice() (array method) to show first 8
    const movies = popularData.results.slice(0, 8);
    renderGrid('trending-grid', movies);

    // Update total movies stat
    const statMovies = document.getElementById('stat-movies');
    if (statMovies) statMovies.textContent = popularData.total_results?.toLocaleString() ?? '—';
  } else {
    if (trendingGrid) trendingGrid.innerHTML = '<p class="error-msg">Could not load movies. Check your API key.</p>';
  }

  // Top Rated
  const topData = await fetchTopRated(1);
  if (topData?.results) {
    const movies = topData.results.slice(0, 8);
    renderGrid('toprated-grid', movies);
  } else {
    const el = document.getElementById('toprated-grid');
    if (el) el.innerHTML = '<p class="error-msg">Could not load top rated movies.</p>';
  }

  updateFavStat();
}

loadHome();
