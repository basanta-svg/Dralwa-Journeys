// Itinerary accordion
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.jdetail-accordion-item').forEach(item => {
    const summary = item.querySelector('.jdetail-accordion-summary');
    summary.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      item.classList.toggle('is-open', !isOpen);
      summary.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Gallery carousel
  const track = document.getElementById('jdetail-gallery-track');
  const prevBtn = document.getElementById('jdetail-gallery-prev');
  const nextBtn = document.getElementById('jdetail-gallery-next');
  if (!track || !prevBtn || !nextBtn) return;

  const slides = Array.from(track.children);
  const slideCount = slides.length;
  let currentIndex = 0;

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, slideCount - getVisibleCount());
  }

  function update() {
    const percent = (currentIndex * 100) / slideCount;
    track.style.transform = `translateX(-${percent}%)`;
  }

  nextBtn.addEventListener('click', () => {
    currentIndex = Math.min(currentIndex + 1, getMaxIndex());
    update();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = Math.max(currentIndex - 1, 0);
    update();
  });

  window.addEventListener('resize', () => {
    currentIndex = Math.min(currentIndex, getMaxIndex());
    update();
  });

  // Drag / swipe to slide
  let isDragging = false;
  let wasDragged = false;
  let startX = 0;
  let deltaX = 0;

  track.addEventListener('pointerdown', (e) => {
    isDragging = true;
    wasDragged = false;
    startX = e.clientX;
    deltaX = 0;
    track.classList.add('is-dragging');
  });

  track.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 5) wasDragged = true;
    const basePercent = (currentIndex * 100) / slideCount;
    const dragPercent = (deltaX / track.clientWidth) * 100;
    track.style.transform = `translateX(calc(-${basePercent}% + ${dragPercent}%))`;
  });

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('is-dragging');

    const threshold = track.clientWidth * 0.15;
    const maxIndex = getMaxIndex();
    if (deltaX < -threshold && currentIndex < maxIndex) {
      currentIndex++;
    } else if (deltaX > threshold && currentIndex > 0) {
      currentIndex--;
    }
    update();
  }

  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointerleave', endDrag);
  track.addEventListener('pointercancel', endDrag);

  update();

  // Lightbox
  const lightbox = document.getElementById('jdetail-lightbox');
  const lightboxImg = document.getElementById('jdetail-lightbox-img');
  const lightboxClose = document.getElementById('jdetail-lightbox-close');

  if (lightbox && lightboxImg && lightboxClose) {
    function openLightbox(img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('is-open');
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightboxImg.src = '';
    }

    slides.forEach(slide => {
      const img = slide.querySelector('img');
      if (!img) return;
      img.addEventListener('click', () => {
        if (wasDragged) return;
        openLightbox(img);
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }
});
