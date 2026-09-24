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

  // ─── Mouse-follow background orbs (page-wide) ─────────────────────────────
  // Inject a fixed, viewport-covering .bg-orbs layer on every page, then
  // track the mouse and push normalized (-1 to 1) coords onto :root as
  // --mx / --my. The CSS translates each orb by a different factor so they
  // fan out from the cursor while the keyframe float keeps the scene alive.
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Inject the orb layer if it isn't already on the page.
  if (!document.querySelector('.bg-orbs')) {
    const layer = document.createElement('div');
    layer.className = 'bg-orbs';
    layer.setAttribute('aria-hidden', 'true');
    for (let i = 1; i <= 3; i++) {
      const orb = document.createElement('div');
      orb.className = `bg-orb bg-orb--${i}`;
      layer.appendChild(orb);
    }
    document.body.insertBefore(layer, document.body.firstChild);
  }

  if (!reducedMotion) {
    let targetX = 0, targetY = 0;   // where the mouse is (normalized)
    let currentX = 0, currentY = 0; // smoothed value we actually write
    const ease = 0.08;              // lower = lazier trail
    let rafId = null;

    const tick = () => {
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      root.style.setProperty('--mx', currentX.toFixed(4));
      root.style.setProperty('--my', currentY.toFixed(4));

      const dx = targetX - currentX;
      const dy = targetY - currentY;
      if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const onMove = (e) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
      if (rafId === null) rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    // Touch: let a single-finger drag nudge the orbs too.
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        onMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
      }
    }, { passive: true });
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

  // ─── Writing: reading time ────────────────────────────────────────────────
  // Counts words in the article body (not the header or summary) and writes
  // "N min read" into every [data-reading-time] element. The HTML ships with
  // a static fallback value in case JS doesn't run.
  const articleBody = document.querySelector('[data-article-body]');

  if (articleBody) {
    const WORDS_PER_MINUTE = 238;
    const words = articleBody.textContent.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
    document.querySelectorAll('[data-reading-time]').forEach((el) => {
      el.textContent = `${minutes} min read`;
    });
  }

  // ─── Writing: table of contents ───────────────────────────────────────────
  // Builds an "In this article" jump list from the body's h2s. Stays hidden
  // for short pieces with fewer than 3 sections.
  const toc = document.querySelector('[data-article-toc]');

  if (toc && articleBody) {
    const headings = articleBody.querySelectorAll('h2');
    const list = toc.querySelector('ol');

    if (list && headings.length >= 3) {
      headings.forEach((h) => {
        if (!h.id) {
          h.id = h.textContent.toLowerCase().trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');
        }
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${h.id}`;
        a.textContent = h.textContent;
        li.appendChild(a);
        list.appendChild(li);
      });
      toc.hidden = false;
    }
  }

  // ─── Writing: reading progress bar ────────────────────────────────────────
  const progress = document.querySelector('.reading-progress');

  if (progress && articleBody) {
    let ticking = false;

    const update = () => {
      const rect = articleBody.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const ratio = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 1;
      progress.style.setProperty('--reading-progress', ratio.toFixed(4));
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    update();
  }

  // ─── Writing: share link ──────────────────────────────────────────────────
  document.querySelectorAll('[data-share="linkedin"]').forEach((link) => {
    const url = encodeURIComponent(window.location.href.split('#')[0]);
    link.href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  });

  // ─── Writing: topic filter ────────────────────────────────────────────────
  // Buttons carry data-filter="topic" ("all" shows everything). Posts carry a
  // space-separated data-topics list.
  const filterButtons = document.querySelectorAll('[data-filter]');
  const posts = document.querySelectorAll('[data-topics]');
  const emptyState = document.querySelector('.post-list__empty');

  if (filterButtons.length && posts.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const topic = btn.dataset.filter;
        let visible = 0;

        filterButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));

        posts.forEach((post) => {
          const match = topic === 'all' || post.dataset.topics.split(' ').includes(topic);
          post.hidden = !match;
          if (match) visible++;
        });

        if (emptyState) emptyState.hidden = visible > 0;
      });
    });
  }

});
