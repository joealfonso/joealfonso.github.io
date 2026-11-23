// theme.js — picks a random accent theme and link-highlight style on every
// page load. Loaded in <head> (not deferred) so both are set before first
// paint. Neither repeats the previous pick, so each reload visibly changes.

(function () {
  var root = document.documentElement;

  function pickFresh(options, key) {
    var last = null;
    try { last = localStorage.getItem(key); } catch (e) {}

    var pool = options.filter(function (o) { return o !== last; });
    var pick = pool[Math.floor(Math.random() * pool.length)];

    try { localStorage.setItem(key, pick); } catch (e) {}
    return pick;
  }

  root.setAttribute('data-theme', pickFresh(
    ['iris', 'sage', 'amber', 'coral', 'violet', 'teal'], 'accent-theme'));

  root.setAttribute('data-highlight', pickFresh(
    ['marker', 'rise', 'bloom', 'thicken'], 'highlight-style'));
})();
