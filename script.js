// safari-legal/script.js
// Shared interactivity for the Aurora marketing site.
// Pure vanilla; no framework.

(function() {
  'use strict';

  // ---------- Sticky nav state ----------
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const updateNavState = () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', updateNavState, { passive: true });
    updateNavState();
  }

  // ---------- Scroll-reveal ----------
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('[data-reveal]').forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      el.classList.add('in-view');
    });
  }

  // ---------- "See the difference" auto-cycle ----------
  const demoPhone = document.getElementById('demo-phone');
  const demoBanner = document.getElementById('demo-banner');
  const btnOff = document.getElementById('demo-btn-off');
  const btnOn = document.getElementById('demo-btn-on');

  if (demoPhone) {
    let isDark = false;
    let autoCycleTimer = null;

    const setMode = (dark) => {
      isDark = dark;
      demoPhone.classList.toggle('dark', dark);
      if (demoBanner) {
        demoBanner.textContent = dark
          ? 'Aurora: ON · Dark Blue theme'
          : 'Aurora: OFF';
      }
      if (btnOff) btnOff.classList.toggle('active', !dark);
      if (btnOn) btnOn.classList.toggle('active', dark);
    };

    const startAutoCycle = () => {
      autoCycleTimer = setInterval(() => setMode(!isDark), 4000);
    };

    const pauseAutoCycle = () => {
      if (autoCycleTimer) {
        clearInterval(autoCycleTimer);
        autoCycleTimer = null;
      }
    };

    if (btnOff) btnOff.addEventListener('click', () => { pauseAutoCycle(); setMode(false); });
    if (btnOn) btnOn.addEventListener('click', () => { pauseAutoCycle(); setMode(true); });

    // Only auto-cycle while the demo is in view (saves battery).
    if ('IntersectionObserver' in window) {
      const demoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAutoCycle();
          } else {
            pauseAutoCycle();
          }
        });
      }, { threshold: 0.3 });
      demoObserver.observe(demoPhone);
    } else {
      startAutoCycle();
    }
  }

  // ---------- Smooth scroll for nav anchors ----------
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
