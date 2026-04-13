# CLAUDE.md — josephalfonso.com

## Who this is for
Joseph Alfonso — Lead UX Designer at Amazon, 15+ years experience, building toward a Principal-level role. This portfolio is his primary external presence alongside LinkedIn. The intended audience is hiring managers, design leaders, and recruiters evaluating senior/principal-level candidates.

**The portfolio must communicate:** lead ownership, strategic thinking, enterprise scale, quantified outcomes, and accessibility advocacy. It should feel polished and confident — not a personal blog, not a student portfolio.

---

## Tech stack
Plain HTML, CSS, and JavaScript. No build tools, no frameworks, no npm. Everything runs directly in the browser.

---

## File structure
```
site/
├── index.html              → Home — project cards grid, hero/intro
├── pages/
│   ├── about.html          → Background, experience, mentoring (Designlab, SVC Seattle)
│   ├── work.html           → Full project listing / case study index
│   └── contact.html        → Contact
├── css/
│   ├── reset.css           → CSS reset — do not edit
│   └── styles.css          → All styles — variables, layout, components
├── js/
│   └── main.js             → JS entry point, runs on DOMContentLoaded
├── images/
│   ├── projects/           → Case study screenshots, covers, before/afters
│   └── icons/              → Favicons, social, UI icons
└── fonts/                  → Local font files (woff2 preferred)
```

---

## Current case studies / projects
These are the active case studies on the site. Reference this when adding cards, writing copy, or building out case study pages.

| Project | Company | Role |
|---|---|---|
| EDM (Enterprise Document Management) | Amazon | Lead Designer — document infrastructure serving billions of docs across dozens of countries |
| Studio | Amazon | Lead Designer |
| Media | Amazon | Lead Designer |
| Home | Amazon | Lead Designer |
| Discovery Education | Discovery Education | Designer |

The **Self-Service Resignation** flow (A to Z mobile app, Amazon) is a long-form case study in development. Key framing: Joseph was the *lead* — ran workshops, met directly with leadership, advocated for humanizing the experience. Not an embedded contributor.

---

## Voice and copy principles
When writing or editing any copy on this site:

- **Lead ownership framing is non-negotiable.** Joseph led these projects — he ran workshops, interfaced with leadership, and drove design decisions. Never frame him as a contributor or embedded designer.
- **Achievement over responsibility.** Reframe task lists as owned outcomes with specific impact (e.g. "Led redesign that reduced drop-off by 34%" not "Responsible for redesign").
- **Quantify outcomes at the feature level** where possible, not just top-line metrics.
- **Accessibility is a visible callout** — it's a core part of his practice and Principal-level differentiator.
- **Reflection sections add credibility** — "What I'd do differently" signals maturity valued at this level.
- **Principal-level audience** — assume the reader evaluates for strategic thinking, stakeholder complexity, and design rationale with tradeoffs, not just execution craft.

---

## CSS conventions
- All variables are defined in `:root` in `styles.css`. Always use them — never hardcode colors, spacing, or type sizes.
- No inline styles. Ever.
- Pages inside `/pages/` reference assets with `../` prefix (e.g. `../css/styles.css`).
- Semantic HTML only: `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`.
- Images: webp preferred, jpg fallback. Optimize before adding.

### Key CSS variables
| Variable | Purpose |
|---|---|
| `--color-bg` | Page background |
| `--color-text` | Primary text |
| `--color-accent` | Links, highlights |
| `--color-muted` | Secondary / subdued text |
| `--font-sans` | Main typeface |
| `--max-width` | Content max width (1200px) |
| `--spacing-xs/sm/md/lg/xl` | Spacing scale |

---

## Common tasks

**Add or update a project card (index.html)**
Each card should include: project title, company, Joseph's role/tenure, a headline metric or outcome, and 2–3 skill tags. See existing cards for the pattern.

**Add a new case study page**
Copy an existing page from `/pages/`, update `<title>` and `<h1>`, add nav link across all pages. Case studies should follow: context → problem → Joseph's role (lead ownership explicit) → process → outcomes (quantified) → reflection.

**Change colors or fonts**
Edit the `:root` block in `styles.css` only. Check `DESIGN.md` for the intended design tokens before making changes.

**Add JS behavior**
Add to `main.js` inside the `DOMContentLoaded` callback, or create a new file with a `<script>` tag before `</body>`.

---

## Out of scope
- Do not introduce npm, Node, or any package manager.
- Do not add CSS frameworks (Tailwind, Bootstrap, etc.).
- Do not add JS frameworks or libraries unless explicitly asked.
- Do not use generic portfolio copy ("passionate designer who loves solving problems"). Write to a Principal-level audience.
