// Checks WCAG AA text contrast for every accent theme in both color modes.
// js/theme.js picks a random theme per page load, so a browser scan only
// ever sees one of them; this reads the tokens straight from styles.css
// and checks all of them. No dependencies: run with `node`.
//
// It also checks hovered/focused links on the highlight stroke (--color-mark
// blended over each background). axe reports those links as "needs review"
// because the stroke is a background gradient it can't measure; this covers
// them. Highlighted links switch to one of HIGHLIGHT_TEXT (see the :hover and
// :focus-visible rules in styles.css).
const fs = require('fs');

const css = fs.readFileSync('css/styles.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const MIN = 4.5;
const TEXT = ['--color-text', '--color-text-secondary', '--color-text-muted', '--color-accent'];
const BACKGROUNDS = ['--color-bg', '--color-surface', '--color-surface-elevated'];
const HIGHLIGHT_TEXT = ['--color-text', '--color-accent-hover'];

// Split a stylesheet into [selector, body] pairs at one nesting level.
function blocks(src) {
  const out = [];
  let depth = 0, start = 0, sel = '';
  for (let i = 0; i < src.length; i++) {
    if (src[i] === '{') {
      if (depth === 0) { sel = src.slice(start, i).trim(); start = i + 1; }
      depth++;
    } else if (src[i] === '}') {
      depth--;
      if (depth === 0) { out.push([sel, src.slice(start, i)]); start = i + 1; }
    }
  }
  return out;
}

function vars(body) {
  const v = {};
  for (const m of body.matchAll(/(--color-[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})\b/g)) v[m[1]] = m[2];
  for (const m of body.matchAll(/(--color-[\w-]+)\s*:\s*rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\s*\)/g)) {
    v[m[1]] = { rgb: [m[2], m[3], m[4]].map(Number), a: Number(m[5]) };
  }
  return v;
}

// Collect base tokens and per-theme overrides for one scope.
function scope(rules) {
  const base = {}, themes = { iris: {} };
  for (const [sel, body] of rules) {
    if (sel === ':root') Object.assign(base, vars(body));
    const t = sel.match(/^:root\[data-theme="(\w+)"\]$/);
    if (t) themes[t[1]] = vars(body);
  }
  return { base, themes };
}

const top = blocks(css);
const light = top.find(([sel]) => /prefers-color-scheme:\s*light/.test(sel));
const modes = {
  dark: scope(top),
  light: light ? scope(blocks(light[1])) : null,
};
if (!modes.light) { console.error('No light-mode block found in styles.css'); process.exit(1); }

const lum = hex => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.substr(i, 2), 16) / 255)
    .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// Composite a translucent color over an opaque hex background.
const blend = ({ rgb, a }, hex) => '#' + rgb.map((c, i) => {
  const under = parseInt(hex.substr(1 + i * 2, 2), 16);
  return Math.round(c * a + under * (1 - a)).toString(16).padStart(2, '0');
}).join('');

let failures = 0, checks = 0;
for (const [mode, { base, themes }] of Object.entries(modes)) {
  for (const [theme, overrides] of Object.entries(themes)) {
    // Mirror the cascade: :root[data-theme] outranks plain :root, so in light
    // mode a dark theme override wins unless the light block redefines it.
    const t = { ...modes.dark.base, ...base, ...modes.dark.themes[theme], ...overrides };
    const pairs = [];
    for (const bg of BACKGROUNDS) {
      for (const fg of TEXT) pairs.push([fg, bg, t[bg]]);
      if (!t['--color-mark']) continue;
      for (const fg of HIGHLIGHT_TEXT) pairs.push([fg, `${bg} + highlight`, blend(t['--color-mark'], t[bg])]);
    }
    for (const [fg, label, color] of pairs) {
      if (!t[fg] || !color) continue;
      checks++;
      const r = ratio(t[fg], color);
      if (r < MIN) {
        failures++;
        console.log(`::error::${mode}/${theme}: ${fg} ${t[fg]} on ${label} ${color} is ${r.toFixed(2)}:1 (needs ${MIN}:1)`);
      }
    }
  }
}

const combos = Object.keys(modes.dark.themes).length * 2;
console.log(`Theme contrast: ${checks} pairs across ${combos} theme/mode combinations, ${failures} below ${MIN}:1.`);
process.exit(failures ? 1 : 0);
