/* =========================================================
   PASLON 2 — Campaign Site interactions
   Vanilla JS. No dependencies.
   ========================================================= */

(function () {
  'use strict';

  /* ---------------- Sticky navbar + blur on scroll ---------------- */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const y = window.scrollY;

    navbar.classList.toggle('is-scrolled', y > 12);
    backToTop.classList.toggle('is-visible', y > 600);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------- Mobile menu drawer ---------------- */
  const menuBtn = document.getElementById('menuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  menuBtn.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.toggle('is-open');
    menuBtn.classList.toggle('is-open', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  mobileDrawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('is-open');
      menuBtn.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------- Scroll indicator click ---------------- */
  const scrollIndicator = document.getElementById('scrollIndicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const poster = document.getElementById('poster');
      if (poster) poster.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------------- Reveal-on-scroll (Intersection Observer) ---------------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el, i) => {
    el.style.setProperty('--i', i % 6);
    revealObserver.observe(el);
  });

  /* ---------------- Active navigation highlighting ---------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('[data-nav]');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((section) => navObserver.observe(section));

  /* ---------------- Ripple button effect ---------------- */
  document.querySelectorAll('.ripple').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const circle = document.createElement('span');
      circle.className = 'ripple-circle';
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(circle);
      circle.addEventListener('animationend', () => circle.remove());
    });
  });

  /* ---------------- Campaign poster fullscreen modal ---------------- */
  const posterCard = document.getElementById('posterCard');
  const posterModal = document.getElementById('posterModal');
  const modalClose = document.getElementById('modalClose');

  function openModal() {
    posterModal.classList.add('is-open');
    posterModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }
  function closeModal() {
    posterModal.classList.remove('is-open');
    posterModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    posterCard.focus();
  }

  posterCard.addEventListener('click', openModal);
  posterCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal();
    }
  });
  modalClose.addEventListener('click', closeModal);
  posterModal.addEventListener('click', (e) => {
    if (e.target === posterModal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && posterModal.classList.contains('is-open')) closeModal();
  });

  /* ---------------- Hero parallax ---------------- */
  const heroField = document.querySelector('.hero__field');
  const hero = document.getElementById('hero');
  let ticking = false;

  function updateParallax() {
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const offset = window.scrollY * 0.18;
      heroField.style.transform = 'translateY(' + offset + 'px)';
    }
    ticking = false;
  }
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    },
    { passive: true }
  );

  /* ---------------- Lazy loading (for any future <img> assets) ---------------- */
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (lazyImages.length) {
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          lazyObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach((img) => lazyObserver.observe(img));
  }
})();
