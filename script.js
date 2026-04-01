/* ======================================================
   POLIS — shared script.js
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── THEME TOGGLE ── */
  const html = document.documentElement;
  const saved = localStorage.getItem('polis-theme');
  if (saved) html.setAttribute('data-theme', saved);

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      localStorage.setItem('polis-theme', next);
    });
  });

  /* ── NAV SCROLL BEHAVIOR ── */
  const nav = document.querySelector('nav');
  const onScroll = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── ACTIVE NAV LINK ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── MOBILE MENU ── */
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('open');
    mobileMenu?.classList.toggle('open');
    document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle?.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── SCROLL REVEAL ── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── COUNTER ANIMATION ── */
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1800;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target) + (el.dataset.suffix || '');
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

  /* ── TABS ── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('[data-tabs]');
      const target = btn.dataset.tab;
      group?.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
      group?.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === target));
    });
  });

  /* ── FELLOW NAME EMAIL REVEAL (hover > 1s) ── */
  // Board cards: hover on card, reveal via .fellow-name::after using data-email-text
  document.querySelectorAll('.fellow-card[data-email]').forEach(card => {
    let timer = null;
    card.addEventListener('mouseenter', () => {
      timer = setTimeout(() => card.classList.add('showing-email'), 1000);
    });
    card.addEventListener('mouseleave', () => {
      clearTimeout(timer);
      card.classList.remove('showing-email');
    });
  });

  // PC names: hover on element itself
  document.querySelectorAll('.pc-name[data-email]').forEach(el => {
    let timer = null;
    el.addEventListener('mouseenter', () => {
      timer = setTimeout(() => el.classList.add('showing-email'), 1000);
    });
    el.addEventListener('mouseleave', () => {
      clearTimeout(timer);
      el.classList.remove('showing-email');
    });
  });

  /* ── DUPLICATE MARQUEE for seamless loop ── */
  document.querySelectorAll('.marquee').forEach(m => {
    // Capture original items only, then clone exactly once for a seamless -50% loop
    const original = m.innerHTML;
    m.innerHTML = original + original;
  });

});
