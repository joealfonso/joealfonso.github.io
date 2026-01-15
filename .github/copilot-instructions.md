<!-- Copilot instructions for contributors and AI agents -->
# Repository orientation

This is a static portfolio / marketing site (no Node build step). Key folders:

- `main/` — page variants and `main/assets/` (built-like asset layout used by pages).
- `js/` — site scripts. Global scripts live at `js/main.js` and `js/*.js`; reusable UI modules live in `js/components/` (files use a `_1_` prefix).
- `styles/` — global CSS (primary file `styles/style.css` contains CSS variables and utility classes).
- `pages/`, `images/`, `fonts/` — content and assets used by pages.

# Quick mental model

- This project is served as static HTML (GitHub Pages). Editing HTML/CSS/JS and pushing to the repo is the primary developer workflow.
- The JavaScript is mix of jQuery-driven page behaviors (`js/main.js`) and plain-vanilla modular UI scripts in `js/components/` (example: `js/components/_1_modal-window.js`).
- CSS uses custom properties and a utility-ish naming scheme (look for `cd-` and `js-` class prefixes). Theme and spacing are driven by variables in `styles/style.css`.

# Patterns & conventions (important for code changes)

- JS hooks: classes prefixed with `js-` are JavaScript hooks (e.g. `js-modal`, `js-overscroll-section`). Prefer targeting those instead of semantic classes when adding behavior.
- Component files in `js/components/` follow single-file, vanilla pattern with a global initializer (see `js/components/_1_modal-window.js` and `js/_1_overscroll-section.js`). Keep changes local to a component where possible.
- There is also jQuery usage in `js/main.js` — avoid removing jQuery unless you update all dependent scripts.
- Accessibility: modal code manages focus, uses `aria-controls` and custom events `openModal`/`closeModal`. Preserve these patterns when modifying modals or introducing new interactive elements.
- Asset paths: pages often reference `main/assets/...` and `images/...`. When moving assets, update all references.

# Typical tasks & how to run/test locally

- Quick local preview: serve the repo root with a static server. Example using Python (Windows PowerShell):

```powershell
python -m http.server 8000
# then open http://localhost:8000/
```

- Alternatively use the VS Code Live Server extension to preview pages.
- There is no package manager or build pipeline in the repository — changes are plain file edits and commits.

# What to watch for when editing

- Don't assume ES module imports — many files are global scripts that attach to `window` (e.g. `Util`, `Modal`). Keep global names stable.
- Naming: several files use leading numeric prefixes (`_1_`) to indicate load/order; do not rename without checking how scripts are included in HTML.
- CSS variables: `styles/style.css` contains the primary tokens — changing a variable name can break theme styles across pages.
- JS event patterns: components emit and consume CustomEvents (e.g. `update-overscroll-section`, `modalIsOpen`). If introducing new pub/sub, follow this pattern.

# Files to inspect for context (quick links)

- See `index.html` and `main/` pages for how scripts and assets are included.
- See `js/components/_1_modal-window.js` for modal behavior and accessibility patterns.
- See `js/_1_overscroll-section.js` for a pattern using `IntersectionObserver` + requestAnimationFrame.
- See `styles/style.css` for CSS variables and utility classes.

# For AI code edits — concrete rules

- Minimize global changes. Prefer patching or adding small functions in `js/components/` or `js/` and update HTML to include them where needed.
- When changing JS behavior, update or add the `js-` class hook and keep ARIA attributes intact.
- Use existing conventions: `data-*` attributes for configuration, CustomEvent names used elsewhere, and `js-` class names for JS-only selectors.
- When modifying markup, ensure assets referenced under `main/assets/` and `images/` remain consistent.

# After applying changes

- Manually run a local static server (see example above) and test interactions: navigation hide/show, modal open/close, overscroll sections, and any page-specific scripts under `main/`.

---
If anything above is unclear or you want more examples (for instance, a guided walkthrough of converting a component), tell me which area to expand.
