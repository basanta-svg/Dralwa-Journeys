document.addEventListener('DOMContentLoaded', () => {
  const envelope  = document.getElementById('main-envelope');
  const overlay   = document.getElementById('page-transition-overlay');
  let   triggered = false;

  function enter() {
    if (triggered) return;
    triggered = true;

    // 1. Envelope lifts with a warm glow (CSS keyframe, 0.9 s)
    envelope.classList.add('clicked');

    // 2. Page begins to fade to ivory after the lift peaks (~700 ms)
    setTimeout(() => overlay.classList.add('active'), 700);

    // 3. Navigate once the fade is complete (0.8 s overlay transition)
    setTimeout(() => { window.location.href = 'index.html'; }, 1550);
  }

  envelope.addEventListener('click',   enter);
  envelope.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enter(); }
  });
});
