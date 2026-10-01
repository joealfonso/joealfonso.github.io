// paint.js — "Paint" mode for the home page.
// Pick a swatch, then click (or Tab + Enter) any [data-paintable] region to
// fill it. Text inside switches to light or dark ink automatically, so it
// always stays readable. Nothing is saved: a reload starts fresh.
// Styles live in the PAINT MODE section of styles.css.

(function () {
  const regions = document.querySelectorAll('[data-paintable]');
  if (!regions.length) return;

  const root = document.documentElement;
  const SWATCHES = ['yellow', 'pink', 'mint', 'sky', 'navy', 'forest', 'plum', 'brick'];
  const ERASER = 'eraser';
  const title = (name) => name.charAt(0).toUpperCase() + name.slice(1);

  const DROP_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c-.3 0-.6.1-.8.4C9.7 4.8 5 10.7 5 14.5a7 7 0 0 0 14 0c0-3.8-4.7-9.7-6.2-11.6a1 1 0 0 0-.8-.4Zm-3.2 12a.9.9 0 0 1 .9.9 2.5 2.5 0 0 0 2.5 2.5.9.9 0 1 1 0 1.8 4.3 4.3 0 0 1-4.3-4.3.9.9 0 0 1 .9-.9Z"/></svg>';
  const ERASER_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.1 3.6a2 2 0 0 1 2.8 0l3 3a2 2 0 0 1 0 2.8l-9.6 9.6H19a1 1 0 1 1 0 2H8.4a2 2 0 0 1-1.4-.6l-3.4-3.4a2 2 0 0 1 0-2.8Zm-4.6 4.6L5 13.8l3.4 3.4h1.7l3.9-3.9Z"/></svg>';

  // ─── Build the UI ─────────────────────────────────────────────────────────
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'paint-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'paint-toolbar');
  toggle.innerHTML = `${DROP_ICON}<span>Paint</span>`;

  const toolbar = document.createElement('div');
  toolbar.id = 'paint-toolbar';
  toolbar.className = 'paint-toolbar';
  toolbar.setAttribute('role', 'toolbar');
  toolbar.setAttribute('aria-label', 'Paint colors');
  toolbar.hidden = true;
  toolbar.innerHTML = `
    <div class="paint-toolbar__tools">
      ${SWATCHES.map((s) => `
        <button type="button" class="paint-swatch paint-swatch--${s}" data-tool="${s}"
          aria-pressed="false" aria-label="Paint with ${title(s)}" title="${title(s)}"></button>
      `).join('')}
      <span class="paint-toolbar__divider" aria-hidden="true"></span>
      <button type="button" class="paint-tool" data-tool="${ERASER}"
        aria-pressed="false" aria-label="Eraser: clear one section" title="Eraser">${ERASER_ICON}</button>
      <button type="button" class="paint-toolbar__text-btn" data-action="reset">Reset</button>
      <button type="button" class="paint-toolbar__text-btn" data-action="close" aria-label="Close paint">&times;</button>
    </div>
    <p class="paint-toolbar__hint">Pick a color, then click a section &middot; Esc to stop</p>
  `;

  const status = document.createElement('p');
  status.className = 'sr-only';
  status.setAttribute('aria-live', 'polite');

  // At the start of <main> (it's fixed-position, so this only affects tab
  // order): Tab from the toolbar goes straight to the paintable sections.
  (document.querySelector('main') || document.body).prepend(toggle, toolbar);
  document.body.append(status);

  const tools = toolbar.querySelectorAll('[data-tool]');
  let tool = null; // current swatch name, ERASER, or null when not painting

  // ─── Ink: pick light or dark text for a swatch (WCAG relative luminance) ──
  const luminance = (hex) => {
    const m = hex.trim().replace('#', '').match(/.{2}/g);
    if (!m || m.length < 3) return 1;
    const [r, g, b] = m.slice(0, 3).map((h) => {
      const c = parseInt(h, 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const inkFor = (swatch) => {
    const hex = getComputedStyle(root).getPropertyValue(`--paint-${swatch}`);
    const l = luminance(hex);
    const vsDark  = (l + 0.05) / (luminance(getComputedStyle(root).getPropertyValue('--ink-dark-text')) + 0.05);
    const vsLight = (1.05) / (l + 0.05);
    return vsDark >= vsLight ? 'dark' : 'light';
  };

  // ─── Painting ─────────────────────────────────────────────────────────────
  const labelOf = (el) => el.dataset.paintable || 'Section';

  const paint = (el) => {
    if (tool === ERASER) {
      if (!el.hasAttribute('data-painted')) return;
      clear(el);
      status.textContent = `${labelOf(el)} cleared`;
      return;
    }
    el.style.setProperty('--paint-bg', `var(--paint-${tool})`);
    el.setAttribute('data-painted', tool);
    el.setAttribute('data-ink', inkFor(tool));
    status.textContent = `${labelOf(el)} painted ${title(tool)}`;

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'paint_section', { color: tool, section: labelOf(el) });
    }
  };

  const clear = (el) => {
    el.style.removeProperty('--paint-bg');
    el.removeAttribute('data-painted');
    el.removeAttribute('data-ink');
  };

  // ─── Modes ────────────────────────────────────────────────────────────────
  const selectTool = (name) => {
    tool = name;
    tools.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tool === name)));
    root.classList.add('is-painting');
    root.style.setProperty('--paint-current', name === ERASER ? 'currentColor' : `var(--paint-${name})`);
    // Make regions reachable from the keyboard while painting
    regions.forEach((el) => { if (!el.hasAttribute('tabindex')) { el.tabIndex = 0; el.dataset.paintTab = ''; } });
  };

  const stopPainting = () => {
    tool = null;
    tools.forEach((b) => b.setAttribute('aria-pressed', 'false'));
    root.classList.remove('is-painting');
    root.style.removeProperty('--paint-current');
    regions.forEach((el) => {
      if (el.hasAttribute('data-paint-tab')) { el.removeAttribute('tabindex'); el.removeAttribute('data-paint-tab'); }
    });
  };

  const open = () => {
    toolbar.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toolbar.querySelector('[data-tool]').focus();
  };

  const close = () => {
    stopPainting();
    toolbar.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  };

  toggle.addEventListener('click', open);

  toolbar.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.tool) {
      if (tool === btn.dataset.tool) stopPainting();   // click again to put the brush down
      else selectTool(btn.dataset.tool);
    } else if (btn.dataset.action === 'reset') {
      regions.forEach(clear);
      status.textContent = 'All sections cleared';
    } else if (btn.dataset.action === 'close') {
      close();
    }
  });

  // Capture phase, so painting a card doesn't also follow its link or the
  // card click handler in main.js.
  document.addEventListener('click', (e) => {
    if (!tool) return;
    const el = e.target.closest('[data-paintable]');
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    paint(el);
  }, true);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !toolbar.hidden) {
      close();
      return;
    }
    if (!tool || (e.key !== 'Enter' && e.key !== ' ')) return;
    if (toolbar.contains(e.target)) return;
    const el = e.target.closest('[data-paintable]');
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    paint(el);
  }, true);
})();
