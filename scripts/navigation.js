// navigation.js — Responsive hamburger menu

const menuBtn = document.getElementById('menu-btn');
const nav = document.querySelector('nav');

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
    menuBtn.classList.toggle('open');
    const expanded = menuBtn.classList.contains('open');
    menuBtn.setAttribute('aria-expanded', expanded);
});

// Close nav when a link is clicked (mobile)
nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', false);
    });
});
