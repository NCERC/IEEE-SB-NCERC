document.addEventListener('DOMContentLoaded', () => {

  // ── PAGE LOADER ──
  const loader = document.getElementById('page-loader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 10);

  // ── NAV SCROLL ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => navbar?.classList.toggle('scrolled', window.scrollY > 40));

  // ── HAMBURGER ──
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileBackdrop = document.querySelector('.mobile-backdrop');

  function closeMobileMenu() {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    mobileBackdrop?.classList.remove('open');
  }

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu?.classList.toggle('open');
    mobileBackdrop?.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-menu a').forEach(a =>
    a.addEventListener('click', closeMobileMenu)
  );
  mobileBackdrop?.addEventListener('click', closeMobileMenu);

  // ── MOBILE EXECOM ACCORDION ──
  const execomToggle = document.getElementById('mobileExecomToggle');
  const execomSub    = document.getElementById('mobileExecomSub');
  execomToggle?.addEventListener('click', () => {
    execomToggle.classList.toggle('open');
    execomSub?.classList.toggle('open');
  });

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
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger').forEach(el => obs.observe(el));

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
      if (loader) {
        loader.classList.remove('hidden');
        window.location.href = href;
      } else {
        window.location.href = href;
      }
    });
  });

  // ── INIT HERO CANVAS ──
  if (typeof initHeroCanvas === 'function') initHeroCanvas();

  // ── HUMAN TOUCH: MAGNETIC LOGO ──
  const logo = document.querySelector('.nav-logo-img');
  if (logo) {
    window.addEventListener('mousemove', (e) => {
      const rect = logo.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (dist < 150) {
        logo.style.transform = `translate(${deltaX / 10}px, ${deltaY / 10}px)`;
      } else {
        logo.style.transform = 'translate(0, 0)';
      }
    });
    logo.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  }

  // ── HUMAN TOUCH: HERO PARALLAX ──
  const heroDecos = document.querySelectorAll('.hero-decoration');
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    heroDecos.forEach((d, i) => {
      const speed = 0.05 + (i * 0.02);
      d.style.transform = `translateY(${scroll * speed}px)`;
    });
  });

  // ── MOBILE REVEAL TABS ──
  const revealCards = document.querySelectorAll('.bento-item, .execom-card, .epc-wrapper, .event-card');
  revealCards.forEach(card => {
    card.addEventListener('click', function(e) {
      if (window.innerWidth <= 900) {
        // Toggle active class on the clicked card
        const isActive = this.classList.contains('active');
        
        // Optionally close other cards
        revealCards.forEach(c => c.classList.remove('active'));
        
        if (!isActive) {
          this.classList.add('active');
        }
      }
    });
  });
});

/**
 * Hand-crafted with care by the NCERC Web Team.
 * Technology is a tool, but the human connection is the goal.
 */