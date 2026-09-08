/* ==========================================================================
   OSSS — shared behaviour for every page.
   Theme switch, expandable nav panels, carousels, accordions, reveals.
   ========================================================================== */
(function () {
  'use strict';

  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DESKTOP = function () { return window.innerWidth > 1080; };

  /* ---------------- theme switch ---------------- */
  var root = document.documentElement;

  function setTheme(t, remember) {
    root.setAttribute('data-theme', t);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#080A1D' : '#0B0D26');
    document.querySelectorAll('.tt').forEach(function (b) {
      b.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    });
    if (remember) { try { localStorage.setItem('osss-theme', t); } catch (e) {} }
  }

  document.querySelectorAll('.tt').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
  });
  setTheme(root.getAttribute('data-theme') || 'light', false);

  /* ---------------- year stamp ---------------- */
  document.querySelectorAll('.yr').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------- mark the current page in the menu ---------------- */
  (function () {
    var here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav .nl').forEach(function (el) {
      var href = el.getAttribute('href');
      var owns = el.getAttribute('data-owns');
      if ((href && href.split('#')[0] === here) ||
          (owns && owns.split(' ').indexOf(here) > -1)) {
        el.classList.add('cur');
      }
    });
  })();

  /* ---------------- header: shadow on scroll + progress bar ---------------- */
  var top = document.querySelector('.top');
  var prog = document.querySelector('.prog');
  var toTop = document.querySelector('.totop');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      if (top) top.classList.toggle('stuck', y > 6);
      if (prog) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      }
      if (toTop) toTop.classList.toggle('on', y > 700);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
    });
  }

  /* ---------------- navigation: expandable panels ---------------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var triggers = Array.prototype.slice.call(document.querySelectorAll('.nl[data-panel]'));

  function panelOf(btn) { return document.getElementById(btn.getAttribute('data-panel')); }

  function closePanels(except) {
    triggers.forEach(function (btn) {
      if (btn === except) return;
      btn.setAttribute('aria-expanded', 'false');
      var p = panelOf(btn);
      if (p) p.classList.remove('open');
    });
  }

  function openPanel(btn) {
    closePanels(btn);
    btn.setAttribute('aria-expanded', 'true');
    var p = panelOf(btn);
    if (p) p.classList.add('open');
  }

  function togglePanel(btn) {
    if (btn.getAttribute('aria-expanded') === 'true') {
      btn.setAttribute('aria-expanded', 'false');
      var p = panelOf(btn);
      if (p) p.classList.remove('open');
    } else {
      openPanel(btn);
    }
  }

  triggers.forEach(function (btn) {
    var panel = panelOf(btn);
    btn.addEventListener('click', function (e) { e.preventDefault(); togglePanel(btn); });

    // hover intent on desktop only
    var hoverTimer;
    function enter() {
      if (!DESKTOP()) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () { openPanel(btn); }, 90);
    }
    function leave() {
      if (!DESKTOP()) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () {
        var host = btn.closest('.item');
        if (host && host.matches(':hover')) return;
        btn.setAttribute('aria-expanded', 'false');
        if (panel) panel.classList.remove('open');
      }, 220);
    }
    var host = btn.closest('.item');
    if (host) {
      host.addEventListener('mouseenter', enter);
      host.addEventListener('mouseleave', leave);
    }
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.item') && DESKTOP()) closePanels(null);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closePanels(null);
    if (nav && nav.classList.contains('open')) closeDrawer();
  });

  /* mobile drawer */
  function measureNav() {
    if (!nav) return;
    var head = document.querySelector('.top');
    var util = document.querySelector('.util');
    var h = (head ? head.getBoundingClientRect().height : 74) +
            (util && window.scrollY < 10 ? util.getBoundingClientRect().height : 0);
    nav.style.setProperty('--navtop', Math.round(h) + 'px');
  }

  function closeDrawer() {
    if (!nav || !burger) return;
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    closePanels(null);
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = !nav.classList.contains('open');
      measureNav();
      nav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
      if (!open) closePanels(null);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && nav.classList.contains('open')) closeDrawer();
    });
    window.addEventListener('resize', function () {
      if (DESKTOP()) { closeDrawer(); }
      else { measureNav(); }
    });
    window.addEventListener('scroll', measureNav, { passive: true });
  }

  /* ---------------- carousels ---------------- */
  document.querySelectorAll('[data-carousel]').forEach(function (host) {
    var track = host.querySelector('.car');
    if (!track) return;
    var prev = host.querySelector('[data-car="prev"]');
    var next = host.querySelector('[data-car="next"]');
    var dots = host.querySelector('.dots');
    var slides = Array.prototype.slice.call(track.children);

    function step() {
      var a = slides[0], b = slides[1];
      if (!a) return track.clientWidth;
      if (!b) return a.getBoundingClientRect().width;
      return b.getBoundingClientRect().left - a.getBoundingClientRect().left;
    }

    if (dots) {
      slides.forEach(function (s, i) {
        var d = document.createElement('button');
        d.type = 'button';
        d.setAttribute('aria-label', 'Go to item ' + (i + 1));
        d.addEventListener('click', function () { track.scrollTo({ left: step() * i, behavior: RM ? 'auto' : 'smooth' }); });
        dots.appendChild(d);
      });
    }

    function sync() {
      var max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
      if (dots) {
        var i = Math.round(track.scrollLeft / step());
        Array.prototype.forEach.call(dots.children, function (d, n) { d.classList.toggle('on', n === i); });
      }
    }

    if (prev) prev.addEventListener('click', function () {
      track.scrollBy({ left: -step(), behavior: RM ? 'auto' : 'smooth' });
    });
    if (next) next.addEventListener('click', function () {
      track.scrollBy({ left: step(), behavior: RM ? 'auto' : 'smooth' });
    });

    var t;
    track.addEventListener('scroll', function () {
      clearTimeout(t);
      t = setTimeout(sync, 70);
    }, { passive: true });
    window.addEventListener('resize', sync);
    sync();

    // pointer drag on desktop
    var down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; sx = e.clientX; sl = track.scrollLeft;
      track.style.scrollBehavior = 'auto';
    });
    track.addEventListener('pointermove', function (e) {
      if (!down) return;
      var d = e.clientX - sx;
      if (Math.abs(d) > 4) moved = true;
      track.scrollLeft = sl - d;
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) {
      track.addEventListener(ev, function () {
        if (!down) return;
        down = false;
        track.style.scrollBehavior = '';
        if (moved) track.scrollTo({ left: Math.round(track.scrollLeft / step()) * step(), behavior: RM ? 'auto' : 'smooth' });
        sync();
      });
    });
    track.addEventListener('click', function (e) { if (moved) e.preventDefault(); }, true);
  });

  /* ---------------- accordions ---------------- */
  document.querySelectorAll('.acc').forEach(function (acc) {
    var single = acc.hasAttribute('data-single');
    acc.querySelectorAll('.ah').forEach(function (head) {
      var body = head.nextElementSibling;
      if (!body) return;

      function close(h, b) {
        b.style.height = b.scrollHeight + 'px';
        requestAnimationFrame(function () { b.style.height = '0px'; });
        h.setAttribute('aria-expanded', 'false');
      }
      function open(h, b) {
        b.style.height = b.scrollHeight + 'px';
        h.setAttribute('aria-expanded', 'true');
        setTimeout(function () { if (h.getAttribute('aria-expanded') === 'true') b.style.height = 'auto'; }, 320);
      }

      head.addEventListener('click', function () {
        var isOpen = head.getAttribute('aria-expanded') === 'true';
        if (single && !isOpen) {
          acc.querySelectorAll('.ah[aria-expanded="true"]').forEach(function (o) {
            close(o, o.nextElementSibling);
          });
        }
        if (isOpen) close(head, body); else open(head, body);
      });

      if (head.getAttribute('aria-expanded') === 'true') body.style.height = 'auto';
    });
  });

  /* ---------------- "read more" on leadership bios ---------------- */
  document.querySelectorAll('.pr .rd').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.pr');
      var open = card.classList.toggle('open');
      btn.textContent = open ? 'Show less' : 'Read more';
    });
  });

  /* ---------------- logo rail: duplicate for a seamless loop ---------------- */
  document.querySelectorAll('.track').forEach(function (track) {
    track.innerHTML += track.innerHTML;
    if (RM) track.style.animation = 'none';
  });

  /* ---------------- reveal on scroll ---------------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
      // threshold 0: a block taller than the viewport can never reach a
      // fractional threshold, so anything above 0 would leave it hidden
    }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.up').forEach(function (el) { io.observe(el); });
  }
  // safety net for odd viewports, printing and headless capture
  setTimeout(function () {
    document.querySelectorAll('.up').forEach(function (el) { el.classList.add('in'); });
  }, 2600);

  /* ---------------- enquiry form ---------------- */
  var form = document.getElementById('enq');
  if (form) {
    var warn = document.getElementById('warn');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      if (!v('f1') || !v('f3') || !v('f4')) { if (warn) warn.classList.add('on'); return; }
      if (warn) warn.classList.remove('on');
      var body = 'Name: ' + v('f1') + '\n' +
                 'Organisation: ' + v('f2') + '\n' +
                 'Email: ' + v('f3') + '\n' +
                 'Phone: ' + v('f4') + '\n' +
                 'Enquiry about: ' + v('f5') + '\n\n' + v('f6');
      window.location.href = 'mailto:info@orientalskills.com?subject=' +
        encodeURIComponent('Website enquiry: ' + v('f5')) + '&body=' + encodeURIComponent(body);
    });
  }
})();
