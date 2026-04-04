// utils.js — shared utilities

// ── Footer year ──────────────────────────────────────
export function setFooterYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll('#current-year, .footer-year')
    .forEach(el => el.textContent = year);
}

// ── Genre map ─────────────────────────────────────────
export const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation',
  35: 'Comedy', 80: 'Crime', 18: 'Drama',
  14: 'Fantasy', 27: 'Horror', 9648: 'Mystery',
  10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller',
  10752: 'War', 37: 'Western', 99: 'Documentary'
};

export function getGenreNames(ids = []) {
  return ids.slice(0, 2).map(id => GENRE_MAP[id] || '').filter(Boolean);
}

// ── Image helpers ─────────────────────────────────────
const IMG_BASE   = 'https://image.tmdb.org/t/p/w342';
const IMG_WIDE   = 'https://image.tmdb.org/t/p/w780';
const PLACEHOLDER = 'https://via.placeholder.com/342x513/16161f/7a7890?text=No+Image';

export function posterUrl(path)   { return path ? `${IMG_BASE}${path}` : PLACEHOLDER; }
export function backdropUrl(path) { return path ? `${IMG_WIDE}${path}` : PLACEHOLDER; }

// ── Format rating ─────────────────────────────────────
export function formatRating(n) {
  return n ? `★ ${n.toFixed(1)}` : '—';
}

// ── Format date to year ───────────────────────────────
export function releaseYear(dateStr) {
  return dateStr ? dateStr.slice(0, 4) : '—';
}
