// date.js — Dynamic year and last modified date

const yearEl = document.getElementById('currentyear');
const lastModEl = document.getElementById('lastModified');

if (yearEl) yearEl.textContent = new Date().getFullYear();
if (lastModEl) lastModEl.textContent = `Last Modified: ${document.lastModified}`;
