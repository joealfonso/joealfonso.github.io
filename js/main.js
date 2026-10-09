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

  // ─── Highlighter-pen text selection ───────────────────────────────────────
  // Each new selection picks up the next pen color (see ::selection in
  // styles.css). Starts on a random pen so the first one varies too.
  const PENS = ['yellow', 'pink', 'green', 'blue', 'orange'];
  let pen = Math.floor(Math.random() * PENS.length);
  document.documentElement.dataset.pen = PENS[pen];

  document.addEventListener('selectstart', () => {
    pen = (pen + 1) % PENS.length;
    document.documentElement.dataset.pen = PENS[pen];
  });

  // ─── Clickable cards ──────────────────────────────────────────────────────
  // Cards ([data-card]) keep their text selectable: only the title is a real
  // link (.card-link), and a click anywhere else on the card follows it —
  // unless the click ended a text selection.
  document.querySelectorAll('[data-card]').forEach((card) => {
    const link = card.querySelector('.card-link');
    if (!link) return;

    const follow = (e, newTab) => {
      if (e.target.closest('a')) return;               // real links handle themselves
      if (String(window.getSelection())) return;       // user was selecting text
      if (newTab) window.open(link.href, '_blank', 'noopener');
      else link.click();
    };

    // Selecting the title's own text shouldn't follow the title link either.
    link.addEventListener('click', (e) => {
      if (String(window.getSelection())) e.preventDefault();
    });

    card.addEventListener('click', (e) => follow(e, e.metaKey || e.ctrlKey || e.shiftKey));
    card.addEventListener('auxclick', (e) => { if (e.button === 1) follow(e, true); });
  });

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

  // ─── Image lightbox ───────────────────────────────────────────────────────
  // Any content image in <main> that isn't part of a link or clickable card
  // opens full-screen.
  // In the lightbox, click (or Enter) toggles between fit-to-screen and full
  // resolution; when zoomed, drag or scroll to pan. Esc, the close button, or
  // a click on the backdrop closes it.
  const zoomables = [...document.querySelectorAll('main img')].filter((img) => !img.closest('a, [data-card]'));

  if (zoomables.length) {
    const lightbox = document.createElement('dialog');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('aria-label', 'Enlarged image');
    lightbox.innerHTML = `
      <button type="button" class="lightbox__close" aria-label="Close">&times;</button>
      <div class="lightbox__stage">
        <img class="lightbox__img" alt="" tabindex="0" />
      </div>
      <p class="lightbox__caption"></p>
      <p class="lightbox__hint">Click image to zoom &middot; Esc to close</p>
    `;
    document.body.appendChild(lightbox);

    const stage   = lightbox.querySelector('.lightbox__stage');
    const big     = lightbox.querySelector('.lightbox__img');
    const caption = lightbox.querySelector('.lightbox__caption');
    const hint    = lightbox.querySelector('.lightbox__hint');
    let opener = null;

    // Only offer zoom when full resolution is actually bigger than the fit.
    const canZoom = () => big.naturalWidth > big.clientWidth + 1 || big.naturalHeight > big.clientHeight + 1;

    const updateZoomable = () => {
      const zoomable = lightbox.classList.contains('is-zoomed') || canZoom();
      big.classList.toggle('is-zoomable', zoomable);
      hint.hidden = !zoomable;
    };

    // FLIP animation: the image has already jumped to its new size/position;
    // play it back from where it was (`from`) to where it is now. Duration and
    // easing come from the motion tokens in styles.css.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const rootStyle = getComputedStyle(document.documentElement);
    const zoomDuration = parseFloat(rootStyle.getPropertyValue('--duration-slow')) || 350;
    const zoomEasing = rootStyle.getPropertyValue('--ease-default').trim() || 'ease-out';

    const animateFrom = (from) => {
      if (reduceMotion.matches || !from.width || !from.height) return;
      const to = big.getBoundingClientRect();
      if (!to.width || !to.height) return;
      big.animate([
        {
          transformOrigin: '0 0',
          transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`,
        },
        { transformOrigin: '0 0', transform: 'none' },
      ], { duration: zoomDuration, easing: zoomEasing });
    };

    const setZoom = (on, point) => {
      if (on && !canZoom()) return;
      // Finish any running zoom so we measure the image's real position.
      big.getAnimations().forEach((a) => a.finish());
      const before = big.getBoundingClientRect();
      lightbox.classList.toggle('is-zoomed', on);
      big.setAttribute('aria-label', on ? 'Zoom out' : 'Zoom in');

      if (on) {
        // Keep the point under the cursor (or the centre, from the keyboard) in place.
        const s  = stage.getBoundingClientRect();
        const px = point ? point.x : before.left + before.width / 2;
        const py = point ? point.y : before.top + before.height / 2;
        const rx = (px - before.left) / before.width;
        const ry = (py - before.top) / before.height;
        stage.scrollLeft = big.offsetLeft + rx * big.clientWidth - (px - s.left);
        stage.scrollTop  = big.offsetTop  + ry * big.clientHeight - (py - s.top);
      }

      animateFrom(before);
    };

    const open = (img) => {
      opener = img;
      lightbox.classList.remove('is-zoomed');
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      big.setAttribute('aria-label', 'Zoom in');
      const figcaption = img.closest('figure')?.querySelector('figcaption');
      caption.textContent = figcaption ? figcaption.textContent.trim() : img.alt;
      caption.hidden = !caption.textContent;
      // Measured before opening: the scroll lock can shift the page.
      const from = img.getBoundingClientRect();
      lightbox.showModal();
      // Grow out of the image on the page. Skipped if the full image isn't
      // decoded yet, since there's nothing to measure.
      if (big.complete) {
        updateZoomable();
        animateFrom(from);
      }
    };

    big.addEventListener('load', updateZoomable);
    window.addEventListener('resize', () => { if (lightbox.open) updateZoomable(); });

    lightbox.addEventListener('close', () => {
      big.removeAttribute('src');
      if (opener) opener.focus();
    });

    lightbox.querySelector('.lightbox__close').addEventListener('click', () => lightbox.close());

    // Mouse drag to pan while zoomed (touch already pans natively). The click
    // that follows a drag is ignored so it can't zoom out or close.
    let drag = null;
    const wasDrag = () => drag && drag.moved;

    // Backdrop / empty stage click closes; image click zooms.
    lightbox.addEventListener('click', (e) => {
      if (wasDrag()) return;
      if (e.target === lightbox || e.target === stage) lightbox.close();
    });

    big.addEventListener('dragstart', (e) => e.preventDefault());

    stage.addEventListener('pointerdown', (e) => {
      if (!lightbox.classList.contains('is-zoomed') || e.button !== 0 || e.pointerType !== 'mouse') return;
      drag = { x: e.clientX, y: e.clientY, left: stage.scrollLeft, top: stage.scrollTop, moved: false };
      stage.setPointerCapture(e.pointerId);
    });

    stage.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) {
        drag.moved = true;
        stage.classList.add('is-dragging');
      }
      stage.scrollLeft = drag.left - dx;
      stage.scrollTop  = drag.top - dy;
    });

    const endDrag = () => {
      stage.classList.remove('is-dragging');
      // Clear after the click event that follows pointerup has run.
      setTimeout(() => { drag = null; });
    };
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    big.addEventListener('click', (e) => {
      if (wasDrag()) return;
      setZoom(!lightbox.classList.contains('is-zoomed'), { x: e.clientX, y: e.clientY });
    });

    big.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setZoom(!lightbox.classList.contains('is-zoomed'));
      }
    });

    zoomables.forEach((img) => {
      img.classList.add('is-zoomable');
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', img.alt ? `Enlarge image: ${img.alt}` : 'Enlarge image');
      img.addEventListener('click', () => open(img));
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(img);
        }
      });
    });
  }

  // ─── Demo videos ──────────────────────────────────────────────────────────
  // Looping demos ([data-autoplay]) start on their own unless the visitor
  // prefers reduced motion. They ship with controls, so anyone can pause
  // them (WCAG 2.2.2).
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('video[data-autoplay]').forEach((video) => {
      video.play().catch(() => {});
    });
  }

});
