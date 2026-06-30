// Mobile menu
const mobileToggle = document.getElementById('inner-mobile-toggle');
const mobileMenu = document.getElementById('inner-mobile-menu');

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  mobileToggle.setAttribute('aria-expanded', 'false');
}

mobileToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  mobileToggle.setAttribute('aria-expanded', isOpen);
});

// Journeys mobile dropdown toggle
const journeysMobileToggle = document.getElementById('journeys-mobile-toggle');
const journeysMobileSubitems = document.getElementById('journeys-mobile-subitems');
if (journeysMobileToggle && journeysMobileSubitems) {
  journeysMobileToggle.addEventListener('click', () => {
    const isOpen = journeysMobileSubitems.classList.toggle('open');
    journeysMobileToggle.classList.toggle('open', isOpen);
    journeysMobileToggle.setAttribute('aria-expanded', isOpen);
  });
}

// Scroll reveal (Intersection Observer)
document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  revealEls.forEach(el => observer.observe(el));

  // ── Stories Slider ──
  const storiesTrack = document.getElementById('stories-track');
  const storiesPrev = document.getElementById('stories-prev');
  const storiesNext = document.getElementById('stories-next');
  const storiesWrapper = storiesTrack.parentElement;
  let storiesIndex = 0;
  let dragStartX = 0, dragCurrentX = 0, isDragging = false, hasDragged = false;

  function getStoriesStep() {
    const card = storiesTrack.children[0];
    const gap = parseFloat(window.getComputedStyle(storiesTrack).gap) || 24;
    return card.offsetWidth + gap;
  }

  function snapStories() {
    const max = storiesTrack.children.length - 1;
    storiesIndex = Math.max(0, Math.min(storiesIndex, max));
    storiesTrack.style.transition = 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)';
    storiesTrack.style.transform = `translateX(-${storiesIndex * getStoriesStep()}px)`;
  }

  storiesNext.addEventListener('click', () => {
    const maxIndex = storiesTrack.children.length - 1;
    if (storiesIndex < maxIndex) { storiesIndex++; snapStories(); }
  });

  storiesPrev.addEventListener('click', () => {
    if (storiesIndex > 0) { storiesIndex--; snapStories(); }
  });

  // Mouse drag
  storiesWrapper.addEventListener('mousedown', e => {
    isDragging = true; hasDragged = false;
    dragStartX = e.clientX;
    storiesTrack.style.transition = 'none';
    storiesWrapper.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    dragCurrentX = e.clientX - dragStartX;
    if (Math.abs(dragCurrentX) > 4) hasDragged = true;
    const base = storiesIndex * getStoriesStep();
    storiesTrack.style.transform = `translateX(${-base + dragCurrentX}px)`;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    storiesWrapper.style.cursor = 'grab';
    const threshold = getStoriesStep() * 0.25;
    if (dragCurrentX < -threshold) storiesIndex++;
    else if (dragCurrentX > threshold) storiesIndex--;
    dragCurrentX = 0;
    snapStories();
  });

  // Prevent clicks on cards firing after a drag
  storiesTrack.addEventListener('click', e => {
    if (hasDragged) e.stopPropagation();
  }, true);

  // Touch drag
  storiesWrapper.addEventListener('touchstart', e => {
    dragStartX = e.touches[0].clientX;
    storiesTrack.style.transition = 'none';
  }, { passive: true });

  storiesWrapper.addEventListener('touchmove', e => {
    dragCurrentX = e.touches[0].clientX - dragStartX;
    const base = storiesIndex * getStoriesStep();
    storiesTrack.style.transform = `translateX(${-base + dragCurrentX}px)`;
  }, { passive: true });

  storiesWrapper.addEventListener('touchend', () => {
    const threshold = getStoriesStep() * 0.25;
    if (dragCurrentX < -threshold) storiesIndex++;
    else if (dragCurrentX > threshold) storiesIndex--;
    dragCurrentX = 0;
    snapStories();
  });

  window.addEventListener('resize', () => { storiesIndex = 0; snapStories(); });

  // ── Interactive Bhutan Map (geographic-matched paths) ──
  const tooltip = document.getElementById('map-tooltip');
  const tooltipName = document.getElementById('map-tooltip-name');
  const tooltipDesc = document.getElementById('map-tooltip-desc');

  // District data — names match the SVG title attributes exactly
  const DISTRICT_DATA = [
    { name: "Ha", desc: "Remote western valley preserving ancient Bon culture and pristine alpine landscapes." },
    { name: "Samtse", desc: "Southernmost district bordering India, rich in subtropical wildlife and tea gardens." },
    { name: "Paro", desc: "Ancient valley with Bhutan's only international airport and the revered Tiger's Nest monastery. Click to explore →", url: "dzongkhag-paro.html" },
    { name: "Chhukha", desc: "Gateway district with iconic hydropower dams, dramatic river gorges, and the town of Phuentsholing." },
    { name: "Thimphu", desc: "Capital district nestled in the Wang Chhu valley, home to the iconic Tashichho Dzong." },
    { name: "Gasa", desc: "Sparsely populated northern district of high-altitude meadows and the famous Gasa hot springs." },
    { name: "Punakha", desc: "Former winter capital, home to Punakha Dzong at the confluence of two rivers." },
    { name: "Dagana", desc: "Subtropical southern district of lush forests and the Dagana Dzong on a hilltop." },
    { name: "Wangdue Phodrang", desc: "Central district known for its dramatic dzong perched above the Punak Tsang Chhu." },
    { name: "Tsirang", desc: "Small fertile district of terraced farms, citrus groves, and warm southern valleys." },
    { name: "Sarpang", desc: "Southern lowland district with Royal Manas National Park and rich biodiversity." },
    { name: "Trongsa", desc: "Strategic highland district where the towering Trongsa Dzong commands the east-west highway." },
    { name: "Bumthang", desc: "Spiritual heartland with ancient temples, valleys of buckwheat, and apple orchards." },
    { name: "Zhemgang", desc: "Remote central district of dense forests, wildlife corridors, and traditional raven lore." },
    { name: "Lhuentse", desc: "Northern ancestral homeland of the royal family, perched above the Kuri Chhu gorge." },
    { name: "Monggar", desc: "Eastern crossroads town surrounded by steep forested slopes and terraced farmland." },
    { name: "Pemagatshel", desc: "Serene eastern district of pine forests, rolling hills, and vibrant local crafts." },
    { name: "Trashigang", desc: "Largest eastern district and cultural hub with the iconic Trashigang Dzong." },
    { name: "Samdrup Jongkha", desc: "Southeastern gateway district bordering Assam with lowland subtropical forests." },
    { name: "Trashi Yangtse", desc: "Far-eastern district where the rare Black-necked crane winters in Bumdeling valley." },
  ];

  // Match each SVG path to its district data by title attribute
  function matchDistricts() {
    const paths = document.querySelectorAll('#bhutan-svg .district');
    const byName = new Map(DISTRICT_DATA.map(d => [d.name, d]));
    const map = new Map();
    for (const path of paths) {
      const name = path.getAttribute('title');
      const d = byName.get(name);
      if (d) map.set(path, d);
    }
    return map;
  }

  // Add centered text labels inside each district shape
  function addMapLabels(assignments) {
    const g = document.getElementById('labels-group');
    for (const [pathEl, d] of assignments) {
      const bb = pathEl.getBBox();
      const cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2;
      const words = d.name.split(' ');
      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('class', 'district-label');
      txt.setAttribute('x', cx); txt.setAttribute('y', cy);
      txt.setAttribute('data-district', d.name);
      if (words.length === 1) {
        txt.textContent = d.name;
      } else {
        const lh = 8, sy = cy - (words.length - 1) * lh / 2;
        words.forEach((w, i) => {
          const ts = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
          ts.setAttribute('x', cx); ts.setAttribute('y', sy + i * lh);
          ts.textContent = w; txt.appendChild(ts);
        });
      }
      g.appendChild(txt);
    }
  }

  // Wire hover/tooltip interactions for each matched path
  function wireMapInteractions(assignments) {
    for (const [pathEl, d] of assignments) {
      pathEl.addEventListener('mouseenter', e => {
        pathEl.classList.add('active');
        tooltipName.textContent = d.name;
        tooltipDesc.textContent = d.desc;
        positionTooltip(e.clientX, e.clientY);
        tooltip.classList.add('visible');
        tooltip.setAttribute('aria-hidden', 'false');
      });
      pathEl.addEventListener('mousemove', e => positionTooltip(e.clientX, e.clientY));
      pathEl.addEventListener('mouseleave', () => {
        pathEl.classList.remove('active');
        tooltip.classList.remove('visible');
        tooltip.setAttribute('aria-hidden', 'true');
      });
      if (d.url) {
        pathEl.style.cursor = 'pointer';
        pathEl.addEventListener('click', () => { window.location.href = d.url; });
        const lbl = document.querySelector(`[data-district="${d.name}"]`);
        if (lbl) { lbl.style.cursor = 'pointer'; lbl.addEventListener('click', () => { window.location.href = d.url; }); }
      }
    }
  }

  // Init map
  const mapAssignments = matchDistricts();
  addMapLabels(mapAssignments);
  wireMapInteractions(mapAssignments);

  // Navbar scroll state
  const navbar = document.querySelector('.inner-navbar');
  const applyScrollState = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', applyScrollState, { passive: true });
  applyScrollState();

  function positionTooltip(cx, cy) {
    const TW = tooltip.offsetWidth || 240;
    const TH = tooltip.offsetHeight || 80;
    const OFFSET = 18;
    let left = cx;
    let top = cy - TH - OFFSET;
    const VW = window.innerWidth;
    left = Math.max(TW / 2 + 8, Math.min(left, VW - TW / 2 - 8));
    if (top < 8) top = cy + OFFSET;
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }
});
