// main.js — entry point

document.addEventListener('DOMContentLoaded', () => {

  // ─── Mobile nav toggle ────────────────────────────────────────────────────
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks  = document.querySelector('.nav__links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navLinks.classList.toggle('is-open', !isOpen);
    });

    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('is-open');
      }
    });
  }

  // ─── Rotating hero text ───────────────────────────────────────────────────
  // Cycles through phrases in the hero headline with a smooth fade transition.
  const rotateEl = document.getElementById('js-rotate');

  if (rotateEl) {
    const phrases = [
      'designs at scale.',
      'mentors the next generation.',
      'navigates AI with intention.',
      'is a positive disruptor.',
      'makes the complex feel simple.',
    ];

    let current = 0;

    const FADE_MS = 900;   // how long the fade out/in takes
    const HOLD_MS = 2500;  // how long each phrase stays visible

    const cycle = () => {
      // Fade out
      rotateEl.classList.add('is-fading');

      setTimeout(() => {
        current = (current + 1) % phrases.length;
        rotateEl.textContent = phrases[current];

        // Fade back in
        rotateEl.classList.remove('is-fading');
      }, FADE_MS);
    };

    setInterval(cycle, HOLD_MS + FADE_MS);
  }

});
