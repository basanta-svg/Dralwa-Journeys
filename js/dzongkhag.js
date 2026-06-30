// Mobile menu
const mobileToggle = document.getElementById('inner-mobile-toggle');
const mobileMenu   = document.getElementById('inner-mobile-menu');

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  mobileToggle.setAttribute('aria-expanded', 'false');
}

mobileToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  mobileToggle.setAttribute('aria-expanded', isOpen);
});

// Navbar scroll state
const navbar = document.querySelector('.inner-navbar');
const applyScrollState = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
window.addEventListener('scroll', applyScrollState, { passive: true });
applyScrollState();

// Scroll reveal
document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('.reveal');
  const observer  = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));

  // ── Filter tabs ──────────────────────────────────────────
  const filterBtns     = document.querySelectorAll('.dz-filter-btn');
  const categoryBlocks = document.querySelectorAll('.dz-category-content');

  function applyFilter(filter) {
    categoryBlocks.forEach(block => {
      block.classList.toggle('hidden', block.dataset.category !== filter);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });

  // Activate the first filter on load
  if (filterBtns.length > 0) {
    filterBtns[0].classList.add('active');
    applyFilter(filterBtns[0].dataset.filter);
  }
});
