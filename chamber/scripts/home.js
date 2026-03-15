// home.js — Weather (OpenWeatherMap), Member Spotlights, Footer dates

// ── Footer dynamic dates ────────────────────────────────
const yearEl     = document.getElementById('current-year');
const modifiedEl = document.getElementById('last-modified');
if (yearEl)     yearEl.textContent = new Date().getFullYear();
if (modifiedEl) modifiedEl.textContent = `Last Modified: ${document.lastModified}`;

// ── Weather ─────────────────────────────────────────────
// Accra coordinates
const WEATHER_LAT  = 5.6037;
const WEATHER_LON  = -0.1870;
const WEATHER_CITY = 'Accra';
// OpenWeatherMap free API key — replace with your own key
const API_KEY = 'ab777359a0f61e4d03006f7c161a78fb';

const weatherCurrentEl  = document.getElementById('weather-current');
const weatherForecastEl = document.getElementById('weather-forecast');

function getWeatherIcon(id) {
  if (id >= 200 && id < 300) return '⛈️';
  if (id >= 300 && id < 400) return '🌦️';
  if (id >= 500 && id < 600) return '🌧️';
  if (id >= 600 && id < 700) return '❄️';
  if (id >= 700 && id < 800) return '🌫️';
  if (id === 800)             return '☀️';
  if (id === 801)             return '🌤️';
  if (id <= 804)              return '☁️';
  return '🌡️';
}

function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function loadWeather() {
  // Guard: if no real key provided, show demo data with note
  if (API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
    renderWeatherDemo(true);
    return;
  }

  try {
    // Current weather
    const curRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${WEATHER_LAT}&lon=${WEATHER_LON}&units=metric&appid=${API_KEY}`
    );
    // 401 = key not yet active; fall back to demo rather than showing an error
    if (!curRes.ok) {
      console.warn(`Weather API returned ${curRes.status} — showing demo data`);
      renderWeatherDemo();
      return;
    }
    const cur = await curRes.json();

    // 5-day / 3-hour forecast → extract next 3 distinct days
    const fRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${WEATHER_LAT}&lon=${WEATHER_LON}&units=metric&appid=${API_KEY}`
    );
    if (!fRes.ok) {
      console.warn(`Forecast API returned ${fRes.status} — showing demo data`);
      renderWeatherDemo();
      return;
    }
    const fData = await fRes.json();

    renderWeatherCurrent(cur);
    renderWeatherForecast(fData.list);
  } catch (err) {
    console.error('Weather load failed:', err);
    renderWeatherDemo();
  }
}

function renderWeatherCurrent(data) {
  const temp    = Math.round(data.main.temp);
  const feels   = Math.round(data.main.feels_like);
  const desc    = capitalise(data.weather[0].description);
  const icon    = getWeatherIcon(data.weather[0].id);
  const humidity = data.main.humidity;
  const wind    = Math.round(data.wind.speed * 3.6); // m/s → km/h

  weatherCurrentEl.innerHTML = `
    <div class="weather-main">
      <span class="weather-icon" aria-hidden="true">${icon}</span>
      <div class="weather-temp-wrap">
        <span class="weather-temp">${temp}°<small>C</small></span>
        <span class="weather-feels">Feels like ${feels}°C</span>
      </div>
    </div>
    <p class="weather-desc">${desc}</p>
    <div class="weather-meta">
      <span>💧 ${humidity}%</span>
      <span>💨 ${wind} km/h</span>
      <span>📍 ${WEATHER_CITY}</span>
    </div>
  `;
}

function renderWeatherForecast(list) {
  // Get one entry per upcoming day (noon slot preferred)
  const today = new Date().toISOString().slice(0, 10);
  const dayMap = new Map();

  for (const item of list) {
    const date = item.dt_txt.slice(0, 10);
    if (date === today) continue;
    if (!dayMap.has(date)) {
      dayMap.set(date, item);
    } else {
      // Prefer the noon entry
      if (item.dt_txt.includes('12:00')) dayMap.set(date, item);
    }
    if (dayMap.size === 3) break;
  }

  const days = [...dayMap.entries()];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  weatherForecastEl.innerHTML = days.map(([date, item]) => {
    const d     = new Date(date + 'T12:00:00');
    const name  = dayNames[d.getDay()];
    const temp  = Math.round(item.main.temp);
    const icon  = getWeatherIcon(item.weather[0].id);
    return `
      <div class="forecast-day">
        <span class="forecast-name">${name}</span>
        <span class="forecast-icon" aria-hidden="true">${icon}</span>
        <span class="forecast-temp">${temp}°C</span>
      </div>`;
  }).join('');
}

// Demo fallback — showNote=true only when no key is configured
function renderWeatherDemo(showNote = false) {
  weatherCurrentEl.innerHTML = `
    <div class="weather-main">
      <span class="weather-icon" aria-hidden="true">⛅</span>
      <div class="weather-temp-wrap">
        <span class="weather-temp">31°<small>C</small></span>
        <span class="weather-feels">Feels like 35°C</span>
      </div>
    </div>
    <p class="weather-desc">Partly cloudy</p>
    <div class="weather-meta">
      <span>💧 78%</span>
      <span>💨 18 km/h</span>
      <span>📍 Accra</span>
    </div>
    ${showNote ? '<p class="weather-demo-note">🔄 API key activating — live data coming soon</p>' : ''}
  `;
  weatherForecastEl.innerHTML = `
    <div class="forecast-day"><span class="forecast-name">Tue</span><span class="forecast-icon">🌧️</span><span class="forecast-temp">29°C</span></div>
    <div class="forecast-day"><span class="forecast-name">Wed</span><span class="forecast-icon">☀️</span><span class="forecast-temp">33°C</span></div>
    <div class="forecast-day"><span class="forecast-name">Thu</span><span class="forecast-icon">⛅</span><span class="forecast-temp">31°C</span></div>
  `;
}

// ── Spotlights ──────────────────────────────────────────
const spotlightsEl = document.getElementById('spotlights-display');

function getMembershipLabel(level) {
  return { 1: 'Member', 2: 'Silver', 3: 'Gold' }[level] || 'Member';
}
function getMembershipClass(level) {
  return `badge-${level}`;
}
function getMembershipIcon(level) {
  return { 1: '●', 2: '◈', 3: '★' }[level] || '●';
}

function buildSpotlightCard(member) {
  const card = document.createElement('article');
  card.className = 'spotlight-card';
  card.setAttribute('aria-label', `${member.name} – ${getMembershipLabel(member.membership)} member spotlight`);
  card.style.animationDelay = `${Math.random() * 0.25}s`;

  const badgeClass = getMembershipClass(member.membership);
  const badgeLabel = getMembershipLabel(member.membership);
  const badgeIcon  = getMembershipIcon(member.membership);
  const imgSrc     = `images/${member.image}`;

  card.innerHTML = `
    <div class="spotlight-header">
      <img src="${imgSrc}"
           alt="${member.name} logo"
           loading="lazy"
           onerror="this.src='images/placeholder.webp'; this.alt='Company logo'">
      <span class="membership-badge ${badgeClass}" aria-label="Membership: ${badgeLabel}">
        ${badgeIcon} ${badgeLabel}
      </span>
    </div>
    <div class="spotlight-body">
      <h3 class="spotlight-name">${member.name}</h3>
      <p class="spotlight-info">📍 ${member.address}</p>
      <p class="spotlight-info">📞 <a href="tel:${member.phone.replace(/\s/g,'')}">${member.phone}</a></p>
      <p class="spotlight-info">🌐 <a href="${member.website}" target="_blank" rel="noopener noreferrer">
        ${member.website.replace(/^https?:\/\//, '')}
      </a></p>
    </div>
  `;
  return card;
}

function pickRandom(arr, n) {
  // Fisher-Yates shuffle, take first n
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

async function loadSpotlights() {
  try {
    const res = await fetch('data/members.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Only gold (3) and silver (2) members
    const eligible = data.members.filter(m => m.membership >= 2);
    // Pick 2 or 3 randomly
    const count    = Math.random() < 0.5 ? 2 : 3;
    const selected = pickRandom(eligible, Math.min(count, eligible.length));

    spotlightsEl.innerHTML = '';
    selected.forEach(m => spotlightsEl.appendChild(buildSpotlightCard(m)));
  } catch (err) {
    console.error('Spotlights load failed:', err);
    const isFile = window.location.protocol === 'file:';
    spotlightsEl.innerHTML = `
      <p class="error-msg" role="alert">
        ⚠️ Unable to load spotlights.
        ${isFile ? '<br><small>Open with <strong>Live Server</strong> in VS Code.</small>' : '<br><small>Please refresh the page.</small>'}
      </p>`;
  }
}

// ── Init ────────────────────────────────────────────────
loadWeather();
loadSpotlights();