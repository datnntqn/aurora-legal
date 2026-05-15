// safari-legal/script.js
// Aurora landing page interactivity — vanilla JS, no framework.
// Effects: sticky nav, shared rAF scroll engine (parallax + compare scrub),
// scroll-reveal stagger, drag + scroll-scrubbed compare slider,
// 3D tilt cards, magnetic CTAs, count-up number stats, smooth scroll.

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Sticky nav state ----------
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const updateNavState = () => nav.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', updateNavState, { passive: true });
    updateNavState();
  }

  // ---------- Shared scroll-progress engine ----------
  // One rAF-throttled passive listener. Effects register a callback
  // that receives (scrollY, viewportHeight) each frame.
  const scrollEffects = [];
  let scrollTicking = false;
  const runScrollEffects = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    for (let i = 0; i < scrollEffects.length; i++) scrollEffects[i](y, vh);
    scrollTicking = false;
  };
  const requestScrollTick = () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(runScrollEffects);
    }
  };
  if (!prefersReducedMotion) {
    window.addEventListener('scroll', requestScrollTick, { passive: true });
    window.addEventListener('resize', requestScrollTick, { passive: true });
  }

  // ---------- Living hero — mesh / grain / glow parallax ----------
  const heroEl = document.getElementById('hero');
  if (heroEl && !prefersReducedMotion) {
    let heroH = heroEl.offsetHeight;
    window.addEventListener('resize', () => { heroH = heroEl.offsetHeight; }, { passive: true });
    scrollEffects.push((y, vh) => {
      // Skip the per-frame writes once the hero is fully scrolled past.
      if (y > heroH + vh) return;
      heroEl.style.setProperty('--mesh-shift',  (y * 0.12) + 'px');
      heroEl.style.setProperty('--grain-shift', (y * 0.28) + 'px');
      heroEl.style.setProperty('--glow-shift',  (y * 0.06) + 'px');
    });
    requestScrollTick(); // set initial values
  }

  // ---------- Scroll-reveal with stagger ----------
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger reveals if multiple are visible together
          setTimeout(() => entry.target.classList.add('in-view'), i * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('in-view'));
  }

  // ---------- Count-up animation for hero stats ----------
  const countUp = (el) => {
    const target = parseFloat(el.dataset.counter);
    if (isNaN(target) || prefersReducedMotion) {
      el.textContent = target || el.textContent;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-counter]').forEach((el) => counterObserver.observe(el));
  }

  // ---------- Compare slider (drag handle) ----------
  const compare = document.getElementById('compare');
  const handle = document.getElementById('compare-handle');
  const darkSide = compare ? compare.querySelector('.compare-dark') : null;
  if (compare && handle && darkSide) {
    let isDragging = false;

    const setPosition = (clientX) => {
      const rect = compare.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      darkSide.style.width = pct + '%';
      handle.style.left = pct + '%';
    };

    const onPointerDown = (e) => {
      isDragging = true;
      handle.setPointerCapture && handle.setPointerCapture(e.pointerId);
      e.preventDefault();
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      setPosition(e.clientX);
    };
    const onPointerUp = () => { isDragging = false; };

    handle.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Click anywhere on compare to jump handle
    compare.addEventListener('click', (e) => {
      if (e.target.closest('.compare-handle')) return;
      setPosition(e.clientX);
    });

    // Scroll-scrub: scroll progress through #features drives the divider.
    // Window (per spec): divider fully left when the section top reaches the
    // viewport bottom; fully right by the time the section is vertically
    // centered; holds at all-dark afterward. Suppressed while dragging.
    if (!prefersReducedMotion) {
      scrollEffects.push((y, vh) => {
        if (isDragging) return;
        const rect = compare.getBoundingClientRect();
        if (rect.bottom < 0) return;   // fully scrolled past — nothing to do
        const start = vh;                              // top === viewport bottom -> p=0
        const end = vh / 2 - rect.height / 2;          // compare element centered -> p=1
        let p = (start - rect.top) / (start - end);
        p = Math.max(0, Math.min(1, p));
        const pct = (p * 100) + '%';
        darkSide.style.width = pct;
        handle.style.left = pct;
      });
      requestScrollTick();
    }
  }

  // ---------- 3D tilt on cards ----------
  if (!prefersReducedMotion) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      let raf = null;
      card.addEventListener('pointermove', (e) => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg) translateZ(2px)`;
        });
      });
      card.addEventListener('pointerleave', () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = '';
      });
    });
  }

  // ---------- Magnetic buttons ----------
  if (!prefersReducedMotion) {
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.3}px)`;
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ---------- Smooth scroll for anchor links ----------
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

  // ---------- Blue Light Filter — interactive slider demo ----------
  const blfSlider = document.getElementById('blfSlider');
  const blfPct    = document.getElementById('blfPct');
  const blfDemo   = document.getElementById('blfDemo');
  const blfLines  = [1,2,3,4,5].map(i => document.getElementById('l'+i));
  if (blfSlider && blfPct && blfDemo && blfLines.every(Boolean)) {
    blfSlider.addEventListener('input', () => {
      const v = parseInt(blfSlider.value, 10);
      blfPct.textContent = v + '%';
      const warmth = v / 100;
      const r = Math.round(79  + warmth * 60);
      const g = Math.round(195 - warmth * 40);
      const b = Math.round(200 - warmth * 150);
      blfLines.forEach(l => { l.style.background = `rgba(${r},${g},${b},0.18)`; });
      blfDemo.style.background = `rgb(${Math.round(10 + warmth*15)},${Math.round(21 - warmth*4)},${Math.round(32 - warmth*18)})`;
    });
  }

})();
