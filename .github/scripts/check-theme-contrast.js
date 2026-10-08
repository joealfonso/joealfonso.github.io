// Checks WCAG AA text contrast for every accent theme in both color modes.
// js/theme.js picks a random theme per page load, so a browser scan only
// ever sees one of them; this reads the tokens straight from styles.css
// and checks all of them. No dependencies: run with `node`.
const fs = require('fs');

const css = fs.readFileSync('css/styles.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const MIN = 4.5;
const TEXT = ['--color-text', '--color-text-secondary', '--color-text-muted', '--color-accent'];
const BACKGROUNDS = ['--color-bg', '--color-surface', '--color-surface-elevated'];

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

let failures = 0, checks = 0;
for (const [mode, { base, themes }] of Object.entries(modes)) {
  for (const [theme, overrides] of Object.entries(themes)) {
    // Mirror the cascade: :root[data-theme] outranks plain :root, so in light
    // mode a dark theme override wins unless the light block redefines it.
    const t = { ...modes.dark.base, ...base, ...modes.dark.themes[theme], ...overrides };
    for (const fg of TEXT) {
      for (const bg of BACKGROUNDS) {
        if (!t[fg] || !t[bg]) continue;
        checks++;
        const r = ratio(t[fg], t[bg]);
        if (r < MIN) {
          failures++;
          console.log(`::error::${mode}/${theme}: ${fg} ${t[fg]} on ${bg} ${t[bg]} is ${r.toFixed(2)}:1 (needs ${MIN}:1)`);
        }
      }
    }
  }
}

const combos = Object.keys(modes.dark.themes).length * 2;
console.log(`Theme contrast: ${checks} pairs across ${combos} theme/mode combinations, ${failures} below ${MIN}:1.`);
process.exit(failures ? 1 : 0);
