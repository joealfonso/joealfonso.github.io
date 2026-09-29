# DESIGN.md — josephalfonso.com

> Plain-text design system for Joseph Alfonso's portfolio.
> AI agents: read this before generating any UI. Use only the tokens and patterns defined here.

---

## Aesthetic Direction

Precise, quiet, and deliberate. It should read like a well-kept technical document written by one person, not a SaaS template or a generic "editorial" portfolio. One type superfamily (IBM Plex), cool paper tones, one ink-blue accent, and real work images carry the page. No decorative effects: no gradient orbs, glassmorphism, animated/rotating headlines, or randomized colors. Hierarchy comes from type and layout (one full-width lead project, then featured projects, then a compact list), not from identical cards.

### Signature motif: the annotated document

The site reads like a working document Joseph has marked up. This is what makes it his, so keep it consistent:

- **Doc header** (`.doc-header`) at the top of the homepage: Doc ID, author, location, revision date, in IBM Plex Mono.
- **Numbered sections**: `<span class="section-heading__num">01</span>` inside `.section-heading`. No § symbol.
- **Project IDs** (`.doc-id`): EDM-01, RES-02, STU-03, AI-04, MED-05, HOM-06. Used only on the Work index, where a catalog number earns its place. Don't add them to homepage cards, lists, or the footer; the motif reads as a theme when it's everywhere.
- **Highlighter** (`<mark>`): only on the one or two figures that matter most in a block. Never decorative.
- **Margin notes** (`.margin-note`): one or two sentences in Joseph's voice beside a project, the kind of thing he'd say in person. Must be true and specific; no slogans.
- **Footer**: the colophon only.
- **Lead project**: EDM on the homepage uses `.feature--lead` (full-width image, larger title, margin note beside the story). This is the one deliberate break in the grid; don't apply it to more than one project.
- **Captions** say what is specifically in the image (who, what number, what changed), never what kind of artifact it is.

Mono (`--font-mono`, IBM Plex Mono) is reserved for this document metadata. Don't use it for body copy or headings.

---

## Colors

One accent: **ink blue**, like an editor's pen on a printed draft. Never randomize or rotate the accent.

### Light mode (`prefers-color-scheme: light`)

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#F6F6F3` | Page background (cool paper) |
| `--color-surface` | `#ECECE7` | Subtle fills, image placeholders |
| `--color-surface-elevated` | `#FFFFFF` | Cards on surface bg |
| `--color-border` | `#DCDCD5` | Default borders, dividers |
| `--color-border-strong` | `#BDBDB4` | Section rules, hover borders |
| `--color-text` | `#16181B` | Headings and primary text |
| `--color-text-secondary` | `#4A4E55` | Body copy, descriptions |
| `--color-text-muted` | `#646870` | Labels, metadata (AA on bg and surface) |
| `--color-text-inverse` | `#F6F6F3` | Text on dark fills |
| `--color-accent` | `#1F45B5` | Links, metrics, active states |
| `--color-accent-hover` | `#16348A` | Accent hover |
| `--color-accent-subtle` | `#E3E9F8` | Accent background tint |

### Dark mode (default)

| Token | Value |
|---|---|
| `--color-bg` | `#121416` |
| `--color-surface` | `#1A1D20` |
| `--color-surface-elevated` | `#202428` |
| `--color-border` | `#2E3338` |
| `--color-border-strong` | `#444A51` |
| `--color-text` | `#ECEEF0` |
| `--color-text-secondary` | `#A9AFB6` |
| `--color-text-muted` | `#8A9098` |
| `--color-accent` | `#8FAEFF` |
| `--color-accent-hover` | `#B5C9FF` |
| `--color-accent-subtle` | `#17213A` |

**Rule:** Never use raw hex values in HTML or CSS. Always reference tokens.

---

## Typography

**Display (`--font-display`):** IBM Plex Serif (Google Fonts), fallback Georgia. Used for all headings, the nav wordmark, project titles, and pull metrics (italic).
**Body (`--font-sans`):** IBM Plex Sans, fallback `system-ui, -apple-system, sans-serif`.

Why Plex: one superfamily built for technical documentation, which fits enterprise work and the annotated-document motif. Avoid swapping in Fraunces, Inter, or other fonts that have become the default look of AI-generated sites.
**Metadata (`--font-mono`):** IBM Plex Mono. Doc IDs, section numbers and the doc header only.

Headings use medium weight (500), not bold. Avoid uppercase tracked "eyebrow" labels on the homepage; use sentence-case muted text instead. Uppercase labels are fine for case-study metadata only.

### Type scale

| Token | rem | px | Usage |
|---|---|---|---|
| `--text-xs` | 0.75rem | 12px | Labels, tags, captions |
| `--text-sm` | 0.875rem | 14px | Nav, card metadata, secondary body |
| `--text-base` | 1rem | 16px | Default body copy |
| `--text-md` | 1.125rem | 18px | Lead text, summaries |
| `--text-lg` | 1.25rem | 20px | Card titles, h5 |
| `--text-xl` | 1.5rem | 24px | Section subheadings, h4 |
| `--text-2xl` | 2rem | 32px | Section headings, h3 |
| `--text-3xl` | 2.5rem | 40px | Page titles, h2 |
| `--text-4xl` | 3.25rem | 52px | Hero headline, h1 |
| `--text-5xl` | 4rem | 64px | Max display size |

### Weights

| Token | Value | Usage |
|---|---|---|
| `--weight-regular` | 400 | Body copy |
| `--weight-medium` | 500 | Nav links, metadata, labels |
| `--weight-semibold` | 600 | Headings, card titles |
| `--weight-bold` | 700 | Hero headline, display text |

### Line heights

| Token | Value | Usage |
|---|---|---|
| `--leading-tight` | 1.2 | Large headings |
| `--leading-snug` | 1.35 | Card titles, sub-headings |
| `--leading-normal` | 1.6 | Body default |
| `--leading-relaxed` | 1.75 | Long-form case study body |

### Letter spacing

| Token | Value | Usage |
|---|---|---|
| `--tracking-tight` | -0.03em | Headings 32px+ |
| `--tracking-normal` | 0em | Body copy |
| `--tracking-wide` | 0.06em | Eyebrow / section labels |
| `--tracking-wider` | 0.10em | ALL CAPS tags, metadata labels |

### Text patterns

**Eyebrow** — Used above section headlines to signal context (company name, category)
```
font-size: --text-sm
font-weight: --weight-medium
letter-spacing: --tracking-wide
text-transform: uppercase
color: --color-accent
```

**Label** — Used for metadata keys, stat labels, form labels
```
font-size: --text-xs
font-weight: --weight-semibold
letter-spacing: --tracking-wider
text-transform: uppercase
color: --color-text-muted
```

**Hero headline** — Use `clamp(--text-3xl, 5vw, --text-5xl)` so it scales fluidly.

---

## Spacing

4px base unit. Always use tokens — never hardcode px values.

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Tight gaps (tag padding, icon gaps) |
| `--space-2` | 8px | Small internal padding |
| `--space-3` | 12px | Tag padding, small stacks |
| `--space-4` | 16px | Base padding, form fields |
| `--space-6` | 24px | Card padding, section gaps |
| `--space-8` | 32px | Component gaps, section padding sm |
| `--space-10` | 40px | Medium section gaps |
| `--space-12` | 48px | Between major elements |
| `--space-16` | 64px | Section padding |
| `--space-24` | 96px | Large section padding |
| `--space-32` | 128px | Hero padding, page-level gaps |

---

## Layout

- **Max width:** `--max-width: 1200px` — all content containers
- **Text max width:** `--max-width-text: 680px` — body copy, case study text
- **Gutter:** `--gutter: 32px` (collapses to 16px on mobile)
- Always use `.container` for horizontal centering and gutters

### Grid

Use `.projects__grid` (auto-fill, 340px min) for project cards. Use `.grid--2`, `.grid--3` for explicit column layouts. Collapse to 1 column at 640px.

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 4px | Tags on surface |
| `--radius-md` | 8px | Buttons, inputs, small cards |
| `--radius-lg` | 12px | Project cards, images, callouts |
| `--radius-xl` | 20px | Large surface panels |
| `--radius-full` | 9999px | Pill tags, avatars |

---

## Shadows

Use sparingly. Only on interactive cards and elevated overlays.

| Token | Usage |
|---|---|
| `--shadow-sm` | Subtle depth on static elements |
| `--shadow-md` | Default card hover |
| `--shadow-lg` | Active card hover (with -2px translateY) |
| `--shadow-xl` | Modals, dropdowns |

---

## Motion

| Token | Value |
|---|---|
| `--ease-default` | `cubic-bezier(0.16, 1, 0.3, 1)` — slightly springy |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` — elements leaving |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` — elements entering |
| `--duration-fast` | 120ms — color, opacity, border |
| `--duration-base` | 200ms — transform, layout |
| `--duration-slow` | 350ms — large transforms, page transitions |

**Rule:** All interactive hover states use `--duration-fast` or `--duration-base`. Never use linear easing.

---

## Components

### Navigation (`.site-header` / `.nav`)

- Sticky, frosted glass: `backdrop-filter: blur(12px)`, 88% opacity background
- Height: 60px
- Logo: semibold, near-black
- Nav links: 14px, medium weight, secondary color → primary on hover/active
- Border bottom: `--color-border`

### Project Card (`.card`)

Structure: image (16:9) → body (eyebrow, title, metric, description) → footer (tags + CTA)

- Border: `--color-border`, radius: `--radius-lg`
- Hover: `--shadow-lg` + `translateY(-2px)` + stronger border
- Eyebrow: ALL CAPS, `--text-xs`, `--color-text-muted`
- Title: `--text-lg`, semibold, tight tracking
- Metric: `--text-sm`, medium, accent color — this is the headline outcome (e.g. "$10M+ annual savings")
- Tags: `.tag` chips in card footer

### Buttons (`.btn`)

Four variants: `--primary` (filled dark), `--secondary` (outlined), `--ghost` (no border), `--accent` (filled blue)
Three sizes: default, `--sm`, `--lg`
All buttons: `transform: scale(0.98)` on `:active`

### Tags / Chips (`.tag`)

- Default: surface bg, border, secondary text — for skills, categories
- `.tag--accent`: blue tint, accent text — for featured or highlighted tags
- `.tag--solid`: dark fill — for primary role/company labels
- Always pill-shaped (`--radius-full`), 12px text, never wrapping

### Stat Block (`.stat-block`)

Use inside case studies to call out key metrics. Surface background, auto-fill grid.
Number: `--text-3xl`, bold, tight tracking. Label: `--text-sm`, secondary.

### Callout (`.callout`)

Use for key insights or quotes in case studies. Accent left border, blue-tinted background. Body text at `--text-md`.

### Case Study Meta (`.case-study-meta`)

Grid of labeled data points: Role, Company, Timeline, Platform, Outcome. Always appears below the case study header, above the cover image.

---

## Do / Don't

**Do:**
- Use `clamp()` for fluid headline sizing on hero and case study headers
- Use `--color-text-secondary` for body copy (not full black — too heavy)
- Put quantified outcomes in `.feature__metric` / `.card__metric` — this is primary signal for Principal-level readers
- Use `--leading-relaxed` for case study body copy

**Don't:**
- Don't use box shadows on text or nav elements
- Don't add borders and shadows simultaneously on the same element at rest
- Don't use more than 2 font weights on a single component
- Don't use color for decoration — only for meaning (accent = interactive/important)
- Don't center-align body copy or long-form text — left-align only
- Don't add gradient orbs, blur/glass effects, rotating headline text, or random palettes — they read as template/AI-generated
- Don't use "X, not Y" slogans or rule-of-three phrasing in copy; use specific facts
- Don't write placeholder copy. Every piece of text on this site reflects Principal-level positioning.
