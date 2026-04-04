// api.js — all TMDB API calls

// ⚠️ Replace this with your own free key from https://www.themoviedb.org
const API_KEY  = 'YOUR_TMDB_API_KEY';
const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Core fetch wrapper with try/catch error handling
 * @param {string} endpoint - TMDB endpoint path + query string
 * @returns {Promise<object|null>} parsed JSON or null on failure
 */
async function tmdbFetch(endpoint) {
  const sep = endpoint.includes('?') ? '&' : '?';
  const url = `${BASE_URL}${endpoint}${sep}api_key=${API_KEY}&language=en-US`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TMDB error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API fetch failed:', error);
    return null;
  }
}

/**
 * Get popular movies — page optional
 */
export async function fetchPopular(page = 1) {
  return tmdbFetch(`/movie/popular?page=${page}`);
}

/**
 * Get top-rated movies
 */
export async function fetchTopRated(page = 1) {
  return tmdbFetch(`/movie/top_rated?page=${page}`);
}

/**
 * Discover movies with genre and sort filters
 */
export async function fetchDiscover({ genreId = '', sortBy = 'popularity.desc', page = 1 } = {}) {
  const genre = genreId ? `&with_genres=${genreId}` : '';
  return tmdbFetch(`/discover/movie?sort_by=${sortBy}${genre}&page=${page}&vote_count.gte=100`);
}

/**
 * Get full movie details by ID
 */
export async function fetchMovieDetails(id) {
  return tmdbFetch(`/movie/${id}`);
}
