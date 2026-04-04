// storage.js — local storage helpers for favourites

const KEY = 'cinescope_favourites';

/**
 * Get all saved favourite movies
 * @returns {Array} array of movie objects
 */
export function getFavourites() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save a movie to favourites
 * @param {object} movie - TMDB movie object
 */
export function addFavourite(movie) {
  const favs = getFavourites();
  if (!favs.find(m => m.id === movie.id)) {
    favs.push(movie);
    localStorage.setItem(KEY, JSON.stringify(favs));
  }
}

/**
 * Remove a movie from favourites by id
 * @param {number} id
 */
export function removeFavourite(id) {
  const favs = getFavourites().filter(m => m.id !== id);
  localStorage.setItem(KEY, JSON.stringify(favs));
}

/**
 * Check if a movie is saved
 * @param {number} id
 * @returns {boolean}
 */
export function isFavourite(id) {
  return getFavourites().some(m => m.id === id);
}

/**
 * Clear all favourites
 */
export function clearFavourites() {
  localStorage.removeItem(KEY);
}

/**
 * Get count of saved favourites
 * @returns {number}
 */
export function getFavCount() {
  return getFavourites().length;
}
