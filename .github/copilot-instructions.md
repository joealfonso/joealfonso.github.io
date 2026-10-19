<!-- Copilot reads this file; the canonical instructions live in AGENTS.md at the repo root. -->
# Repository instructions

Follow [AGENTS.md](../AGENTS.md) at the repository root: audience, voice and copy principles, file structure, CSS conventions, CI checks, and out-of-scope rules.

Notes specific to this repo layout:

- Styles are in `css/styles.css` (variables in `:root`); there is no `styles/` folder.
- Preview locally with `python3 -m http.server 8000` from the repo root.
- Run `.github/scripts/check-site-rules.sh` and `node .github/scripts/check-theme-contrast.js` before opening a PR.
