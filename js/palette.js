// palette.js — Sets randomised accent + orb CSS custom properties before first paint.
// Loaded as a synchronous (non-deferred) script so colours apply before the page renders.
(function () {
  var palettes = [
    {
      orbs: ['rgba(0,82,204,0.15)',   'rgba(99,102,241,0.12)',  'rgba(14,165,233,0.09)'],
      accent:       '#0052CC', accentHover: '#003D99', accentSubtle: '#EBF2FF',
      accentDark:   '#4D94FF', accentHoverDark: '#7AB3FF', accentSubtleDark: '#0F1E38',
    },
    {
      orbs: ['rgba(20,184,166,0.15)', 'rgba(6,182,212,0.12)',   'rgba(16,185,129,0.09)'],
      accent:       '#0D9488', accentHover: '#0F766E', accentSubtle: '#CCFBF1',
      accentDark:   '#2DD4BF', accentHoverDark: '#5EEAD4', accentSubtleDark: '#042F2E',
    },
    {
      orbs: ['rgba(147,51,234,0.14)', 'rgba(168,85,247,0.11)',  'rgba(99,102,241,0.09)'],
      accent:       '#7C3AED', accentHover: '#6D28D9', accentSubtle: '#EDE9FE',
      accentDark:   '#A78BFA', accentHoverDark: '#C4B5FD', accentSubtleDark: '#1E1040',
    },
    {
      orbs: ['rgba(217,119,6,0.14)',  'rgba(234,88,12,0.11)',   'rgba(245,158,11,0.09)'],
      accent:       '#D97706', accentHover: '#B45309', accentSubtle: '#FEF3C7',
      accentDark:   '#FCD34D', accentHoverDark: '#FDE68A', accentSubtleDark: '#2D1B00',
    },
    {
      orbs: ['rgba(225,29,72,0.13)',  'rgba(217,70,239,0.11)',  'rgba(239,68,68,0.08)'],
      accent:       '#E11D48', accentHover: '#BE123C', accentSubtle: '#FFE4E6',
      accentDark:   '#FB7185', accentHoverDark: '#FDA4AF', accentSubtleDark: '#2D0A12',
    },
  ];

  var dark = true;

  function boost(c) {
    return dark ? c.replace(/,([\d.]+)\)$/, function (_, v) {
      return ',' + Math.min(parseFloat(v) * 1.8, 0.4) + ')';
    }) : c;
  }

  var p = palettes[Math.floor(Math.random() * palettes.length)];
  var r = document.documentElement;

  r.style.setProperty('--orb-1', boost(p.orbs[0]));
  r.style.setProperty('--orb-2', boost(p.orbs[1]));
  r.style.setProperty('--orb-3', boost(p.orbs[2]));

  r.style.setProperty('--color-accent',        dark ? p.accentDark       : p.accent);
  r.style.setProperty('--color-accent-hover',  dark ? p.accentHoverDark  : p.accentHover);
  r.style.setProperty('--color-accent-subtle', dark ? p.accentSubtleDark : p.accentSubtle);
})();
