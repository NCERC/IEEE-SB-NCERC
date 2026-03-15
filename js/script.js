document.addEventListener('DOMContentLoaded', () => {

  // ── PAGE LOADER ──
  const loader = document.getElementById('page-loader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 1400);

  // ── NAV SCROLL ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => navbar?.classList.toggle('scrolled', window.scrollY > 40));

  // ── HAMBURGER ──
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  hamburger?.addEventListener('click', () => { hamburger.classList.toggle('open'); mobileMenu?.classList.toggle('open'); });
  document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => { hamburger?.classList.remove('open'); mobileMenu?.classList.remove('open'); }));

  // ── ACTIVE NAV ──
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    if (link.getAttribute('href')?.split('/').pop() === current) link.classList.add('active');
  });

  // ── TICKER ──
  const track = document.querySelector('.ticker-track');
  if (track) track.innerHTML += track.innerHTML;

  // ── SCROLL REVEAL ──
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => obs.observe(el));
  setTimeout(() => document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => el.classList.add('visible')), 2000);

  // ── COUNTER ──
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = parseInt(el.dataset.count), suffix = el.dataset.suffix || '';
      let cur = 0; const step = Math.ceil(target / 60);
      const tick = () => { cur = Math.min(cur + step, target); el.textContent = cur + suffix; if (cur < target) requestAnimationFrame(tick); };
      tick(); cObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(c => cObs.observe(c));

  // ── LIGHTBOX ──
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightbox && lightboxImg) { lightboxImg.src = img.src; lightbox.classList.add('open'); document.body.style.overflow = 'hidden'; }
    });
  });
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
  });

  // ── GALLERY FILTER ──
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.gallery-item').forEach(item => {
        item.style.display = (filter === 'all' || item.dataset.category === filter) ? 'block' : 'none';
      });
    });
  });

  // ── CONTACT FORM ──
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const orig = btn.textContent; btn.textContent = 'SENDING...'; btn.disabled = true;
    setTimeout(() => { btn.textContent = 'SENT ✓'; setTimeout(() => { btn.textContent = orig; btn.disabled = false; contactForm.reset(); }, 3000); }, 1500);
  });

  // ── PAGE TRANSITION ──
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      const loader = document.getElementById('page-loader');
      if (loader) { loader.classList.remove('hidden'); setTimeout(() => { window.location.href = href; }, 350); }
      else window.location.href = href;
    });
  });

  // ── INIT HERO CANVAS ──
  if (typeof initHeroCanvas === 'function') initHeroCanvas();
});