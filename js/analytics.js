(function () {
  if (typeof window.gtag !== 'function') return;

  // Map URL paths to case study names for event params
  var CASE_STUDIES = {
    '/pages/edm.html':         'EDM',
    '/pages/studio.html':      'Studio',
    '/pages/platform.html':    'Home',
    '/pages/channels.html':    'Media',
    '/pages/home.html':        'Home',
    '/pages/dex.html':         'Discovery Education',
    '/pages/resignation.html': 'Resignation',
    '/pages/ai-work.html':     'AI Work',
  };

  var path = window.location.pathname;
  var caseStudy = CASE_STUDIES[path] || null;

  // ── case_study_open ─────────────────────────────────────────────────────────
  // Fires once on load for any case study page.
  if (caseStudy) {
    gtag('event', 'case_study_open', { case_study_name: caseStudy });
  }

  // ── scroll_depth + read_complete ────────────────────────────────────────────
  // scroll_depth fires at 25 / 50 / 75 percent for case study pages.
  // read_complete fires when 75% scroll AND 60 s on page are both satisfied.
  if (caseStudy) {
    var THRESHOLDS = [25, 50, 75];
    var fired = {};
    var reached75 = false;
    var stayed60s = false;

    function fireReadComplete() {
      gtag('event', 'read_complete', { case_study_name: caseStudy });
    }

    setTimeout(function () {
      stayed60s = true;
      if (reached75) fireReadComplete();
    }, 60000);

    function onScroll() {
      var scrolled = window.scrollY + window.innerHeight;
      var total = document.documentElement.scrollHeight;
      var pct = (scrolled / total) * 100;

      for (var i = 0; i < THRESHOLDS.length; i++) {
        var t = THRESHOLDS[i];
        if (pct >= t && !fired[t]) {
          fired[t] = true;
          gtag('event', 'scroll_depth', { case_study_name: caseStudy, percent: t });

          if (t === 75) {
            reached75 = true;
            if (stayed60s) fireReadComplete();
          }
        }
      }

      if (fired[25] && fired[50] && fired[75]) {
        window.removeEventListener('scroll', onScroll);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── contact_click ───────────────────────────────────────────────────────────
  // Fires on mailto link clicks anywhere on the site.
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (el) {
    el.addEventListener('click', function () {
      gtag('event', 'contact_click', { method: 'mailto' });
    });
  });

  // Fires when someone copies text that looks like an email address.
  document.addEventListener('copy', function () {
    var sel = window.getSelection ? window.getSelection().toString().trim() : '';
    if (sel.indexOf('@') !== -1) {
      gtag('event', 'contact_click', { method: 'copy_email' });
    }
  });

  // ── resume_view ─────────────────────────────────────────────────────────────
  // Fires when a PDF link whose href contains "resume" or "cv" is clicked.
  document.querySelectorAll('a[href$=".pdf"]').forEach(function (el) {
    el.addEventListener('click', function () {
      var href = (el.getAttribute('href') || '').toLowerCase();
      if (href.indexOf('resume') !== -1 || href.indexOf('cv') !== -1) {
        gtag('event', 'resume_view', { file: el.getAttribute('href') });
      }
    });
  });

})();
