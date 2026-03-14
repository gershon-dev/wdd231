// directory.js — Fetch members from JSON and render grid/list views

const display   = document.getElementById('member-display');
const gridBtn   = document.getElementById('grid-btn');
const listBtn   = document.getElementById('list-btn');
const yearEl    = document.getElementById('current-year');
const modifiedEl = document.getElementById('last-modified');

// ── Footer dynamic dates ────────────────────────────────
if (yearEl)     yearEl.textContent = new Date().getFullYear();
if (modifiedEl) modifiedEl.textContent = `Last Modified: ${document.lastModified}`;

// ── Membership label helpers ────────────────────────────
function getMembershipLabel(level) {
  const map = { 1: 'Member', 2: 'Silver', 3: 'Gold' };
  return map[level] || 'Member';
}

function getMembershipClass(level) {
  return `badge-${level}` || 'badge-1';
}

function getMembershipIcon(level) {
  const icons = { 1: '●', 2: '◈', 3: '★' };
  return icons[level] || '●';
}

// ── Build a single member card ──────────────────────────
function buildCard(member) {
  const card = document.createElement('article');
  card.className = 'member-card';
  card.setAttribute('aria-label', `${member.name} – ${getMembershipLabel(member.membership)} member`);

  // Stagger animation
  card.style.animationDelay = `${Math.random() * 0.2}s`;

  const imgSrc = `images/${member.image}`;
  const badgeClass = getMembershipClass(member.membership);
  const badgeLabel = getMembershipLabel(member.membership);
  const badgeIcon  = getMembershipIcon(member.membership);

  card.innerHTML = `
    <img src="${imgSrc}"
         alt="${member.name} logo"
         loading="lazy"
         onerror="this.src='images/placeholder.webp'; this.alt='Company logo placeholder'">
    <div class="card-main">
      <h2 class="member-name">${member.name}</h2>
      <p class="member-desc">${member.description}</p>
      <div class="member-info">
        <p>📍 ${member.address}</p>
        <p>📞 <a href="tel:${member.phone.replace(/\s/g,'')}">${member.phone}</a></p>
        <p>🌐 <a href="${member.website}" target="_blank" rel="noopener noreferrer">
          ${member.website.replace(/^https?:\/\//, '')}
        </a></p>
      </div>
    </div>
    <span class="membership-badge ${badgeClass}" aria-label="Membership level: ${badgeLabel}">
      ${badgeIcon} ${badgeLabel}
    </span>
  `;

  return card;
}

// ── Render all cards ────────────────────────────────────
function renderMembers(members) {
  display.innerHTML = '';
  members.forEach(member => {
    display.appendChild(buildCard(member));
  });
}

// ── Fetch & initialise ──────────────────────────────────
// NOTE: Must be served via a local server (Live Server in VS Code).
// Fetch does not work when opening HTML files directly via file://.
async function loadMembers() {
  display.innerHTML = '<p class="loading-msg" role="status">Loading members…</p>';

  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    renderMembers(data.members);
  } catch (err) {
    console.error('Failed to load members:', err);
    // Show a helpful message distinguishing file:// vs server errors
    const isFileProtocol = window.location.protocol === 'file:';
    display.innerHTML = `
      <p class="error-msg" role="alert">
        ⚠️ Unable to load member directory.
        ${isFileProtocol
          ? '<br><small>You are opening this file directly. Please use <strong>Live Server</strong> in VS Code instead.</small>'
          : '<br><small>Please try refreshing the page.</small>'
        }
      </p>`;
  }
}

// ── View toggle ─────────────────────────────────────────
function setView(view) {
  if (view === 'grid') {
    display.classList.remove('list-view');
    display.classList.add('grid-view');
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
    gridBtn.setAttribute('aria-pressed', 'true');
    listBtn.setAttribute('aria-pressed', 'false');
    localStorage.setItem('chamber-view', 'grid');
  } else {
    display.classList.remove('grid-view');
    display.classList.add('list-view');
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
    listBtn.setAttribute('aria-pressed', 'true');
    gridBtn.setAttribute('aria-pressed', 'false');
    localStorage.setItem('chamber-view', 'list');
  }
}

gridBtn.addEventListener('click', () => setView('grid'));
listBtn.addEventListener('click', () => setView('list'));

// ── Restore saved view preference ──────────────────────
const savedView = localStorage.getItem('chamber-view') || 'grid';
setView(savedView);

// ── Kick off ────────────────────────────────────────────
loadMembers();