// theme.js — picks a random accent theme on every page load.
// Loaded in <head> (not deferred) so the theme is set before first paint.
// Never repeats the previous theme, so each reload visibly changes.

(function () {
  var THEMES = ['iris', 'sage', 'amber', 'coral', 'violet', 'teal'];
  var KEY = 'accent-theme';
  var last = null;

  try { last = localStorage.getItem(KEY); } catch (e) {}

  var pool = THEMES.filter(function (t) { return t !== last; });
  var theme = pool[Math.floor(Math.random() * pool.length)];

  document.documentElement.setAttribute('data-theme', theme);

  try { localStorage.setItem(KEY, theme); } catch (e) {}
})();
