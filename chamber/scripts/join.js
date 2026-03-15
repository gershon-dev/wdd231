// join.js — Form timestamp, modal interactions, footer dates

// ── Footer dates ────────────────────────────────────────
const yearEl     = document.getElementById('current-year');
const modifiedEl = document.getElementById('last-modified');
if (yearEl)     yearEl.textContent = new Date().getFullYear();
if (modifiedEl) modifiedEl.textContent = `Last Modified: ${document.lastModified}`;

// ── Timestamp hidden field ───────────────────────────────
const tsField = document.getElementById('timestamp');
if (tsField) {
  const now = new Date();
  tsField.value = now.toLocaleString('en-GB', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
}

// ── Modal open/close ────────────────────────────────────
document.querySelectorAll('.mem-card__link').forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.dataset.modal;
    const modal = document.getElementById(modalId);
    if (modal) modal.showModal();
  });
});

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('dialog');
    if (modal) modal.close();
  });
});

// Close modal on backdrop click
document.querySelectorAll('.mem-modal').forEach(modal => {
  modal.addEventListener('click', e => {
    const rect = modal.getBoundingClientRect();
    const clickedOutside =
      e.clientX < rect.left || e.clientX > rect.right ||
      e.clientY < rect.top  || e.clientY > rect.bottom;
    if (clickedOutside) modal.close();
  });
});

// Close modals on Escape key (native dialog handles this, but be explicit)
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('dialog[open]').forEach(d => d.close());
  }
});
