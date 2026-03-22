document.addEventListener('DOMContentLoaded', () => {

  // ── PAGE LOADER ──
  const loader = document.getElementById('page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      loader.classList.add('hidden');
    });
    // Fallback if load event takes too long
    setTimeout(() => loader.classList.add('hidden'), 2500);
  }

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
  
  document.querySelectorAll('.gallery-item, .execom-card').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.style.opacity = '0';
        lightboxImg.src = img.src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        if (lightboxImg.complete) {
          lightboxImg.style.opacity = '1';
        } else {
          lightboxImg.onload = () => { lightboxImg.style.opacity = '1'; };
        }
      }
    });
  });
  
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      if (lightboxImg) lightboxImg.src = ''; // Clear src to stop loading if pending
    }
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

  // ── PAGE TRANSITION (instant — no loader delay) ──
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      window.location.href = href; // Navigate immediately, no loader
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



  // ── SCROLL PROGRESS & BACK TO TOP ──
  const progress = document.createElement('div');
  progress.id = 'scroll-progress'; document.body.appendChild(progress);

  const btt = document.createElement('div');
  btt.id = 'back-to-top'; btt.innerHTML = '↑'; document.body.appendChild(btt);
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progress.style.width = scrolled + '%';
    
    btt.classList.toggle('visible', window.scrollY > 500);
  });

  // ── MAGNETIC BUTTONS ──
  const magnets = document.querySelectorAll('.btn, .social-btn, .nav-logo-img, .magnetic');
  magnets.forEach(m => {
    m.addEventListener('mousemove', e => {
      const rect = m.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      m.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    m.addEventListener('mouseleave', () => {
      m.style.transform = 'translate(0, 0)';
    });
  });

  // ── REVEAL STAGGER FIX ──
  document.querySelectorAll('.reveal-stagger').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.style.transitionDelay = `${(i + 1) * 0.05}s`;
      child.classList.add('reveal');
    });
  });

  // ── MOBILE REVEAL TABS ──
  const revealCards = document.querySelectorAll('.bento-item, .execom-card, .epc-wrapper, .event-card');
  revealCards.forEach(card => {
    card.addEventListener('click', function() {
      if (window.innerWidth <= 900) {
        const isActive = this.classList.contains('active');
        revealCards.forEach(c => c.classList.remove('active'));
        if (!isActive) this.classList.add('active');
      }
    });
  });
});

/**
 * Hand-crafted with care by the NCERC Web Team.
 * Technology is a tool, but the human connection is the goal.
 */