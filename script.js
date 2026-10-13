/* =========================================================
   Portfolio interactions
   Sections: loader, particles, typing effect, scroll spy,
   reveal-on-scroll, counters, skill bars, ripple, contact
   form, toast, back-to-top, cursor glow, mobile nav.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Loading screen — hide once everything is ready
  --------------------------------------------------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('is-hidden'), 400);
  });
  // Safety net in case 'load' fires late or already fired
  setTimeout(() => loader && loader.classList.add('is-hidden'), 2500);

  /* ---------------------------------------------------------
     Sticky navbar background on scroll + active link spy
  --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  function onScroll() {
    navbar.classList.toggle('is-scrolled', window.scrollY > 30);

    // scroll progress bar
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = (doc.scrollHeight - doc.clientHeight) || 1;
    const progress = (scrollTop / scrollHeight) * 100;
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) progressBar.style.width = progress + '%';

    // back to top visibility
    const backToTop = document.getElementById('backToTop');
    if (backToTop) backToTop.classList.toggle('is-visible', scrollTop > 500);

    // active nav link (scroll-spy)
    let current = sections[0];
    const offset = 140;
    sections.forEach(sec => {
      if (window.scrollY + offset >= sec.offsetTop) current = sec;
    });
    navLinks.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current.id);
    });
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.forEach(link => link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------------------------------------------------------
     Back to top button
  --------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------
     Typing effect in hero terminal line
  --------------------------------------------------------- */
  const typerEl = document.getElementById('typerText');
  const phrases = [
    'building full-stack products end to end',
    'debugging JavaScript at 2am, again',
    'training myself on prompt engineering',
    'shipping side projects for Zero to Value',
    'turning ideas into deployed code'
  ];
  if (typerEl && !prefersReducedMotion) {
    let phraseIndex = 0, charIndex = 0, deleting = false;

    function typeLoop() {
      const current = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        typerEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1600);
          return;
        }
      } else {
        charIndex--;
        typerEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(typeLoop, deleting ? 30 : 55);
    }
    typeLoop();
  } else if (typerEl) {
    typerEl.textContent = phrases[0];
  }

  /* ---------------------------------------------------------
     Reveal-on-scroll (fade + slide) via IntersectionObserver
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------------
     Animated counters (stats)
  --------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const duration = 1400;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------------------------------------------------------
     Skill bar fill animation on scroll
  --------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.skill-bar');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      const level = bar.getAttribute('data-level') || '0';
      const fill = bar.querySelector('.skill-bar__fill');
      if (fill) fill.style.width = level + '%';
      skillObserver.unobserve(bar);
    });
  }, { threshold: 0.4 });
  skillBars.forEach(bar => skillObserver.observe(bar));

  /* ---------------------------------------------------------
     Ripple effect on buttons
  --------------------------------------------------------- */
  document.querySelectorAll('[data-ripple]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------------------------------------------------------
     Toast helper
  --------------------------------------------------------- */
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }

  /* ---------------------------------------------------------
     Resume button — no file attached, give friendly feedback
  --------------------------------------------------------- */
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      showToast('Resume link coming soon — reach out via the contact form for now!');
    });
  }

  /* ---------------------------------------------------------
     Contact form — front-end validation + feedback
     (no backend wired up; swap the timeout for a real fetch())
  --------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        if (formNote) formNote.textContent = 'Please fill in every field before sending.';
        return;
      }
      if (!emailPattern.test(email)) {
        if (formNote) formNote.textContent = 'That email address doesn\'t look quite right.';
        return;
      }

      if (formNote) formNote.textContent = 'Sending...';
      setTimeout(() => {
        if (formNote) formNote.textContent = `Thanks, ${name.split(' ')[0]}! Your message is on its way.`;
        showToast('Message sent — I\'ll get back to you soon!');
        contactForm.reset();
      }, 700);
    });
  }

  /* ---------------------------------------------------------
     Cursor glow (desktop, pointer-fine devices only)
  --------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.classList.add('is-active');
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    });
    document.addEventListener('mouseleave', () => cursorGlow.classList.remove('is-active'));
  }

  /* ---------------------------------------------------------
     Hero particle background (lightweight canvas animation)
  --------------------------------------------------------- */
  const canvas = document.getElementById('particles');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height, animationId;

    function resize() {
      const hero = canvas.closest('.hero');
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      const count = Math.min(70, Math.floor((width * height) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        hue: Math.random() > 0.5 ? '124,92,255' : '0,229,255'
      }));
    }

    function drawFrame() {
      ctx.clearRect(0, 0, width, height);

      // connective lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i], p2 = particles[j];
          const dx = p1.x - p2.x, dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(124,92,255,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},0.55)`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(drawFrame);
    }

    resize();
    createParticles();
    drawFrame();

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animationId);
      resize();
      createParticles();
      drawFrame();
    });
  }

});
