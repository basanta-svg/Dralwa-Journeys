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
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));
});
