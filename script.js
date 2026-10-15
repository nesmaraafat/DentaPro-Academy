// DentaPro Academy: small helpers (Bootstrap handles the carousel, tabs, and scrollspy)

(() => {
  // 1) Navbar turns solid after scrolling, and while the mobile menu is open
  const nav = document.getElementById('siteNav');
  const menu = document.getElementById('navMenu');
  const SOLID_AT = 10; // px scrolled before the navbar gets its background
  let ticking = false;
  const updateNav = () => {
    nav.classList.toggle('is-solid', window.scrollY > SOLID_AT || menu.classList.contains('show'));
    ticking = false;
  };

  updateNav(); // also runs on load, in case the page opens already scrolled
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateNav); }
  }, { passive: true });
  menu.addEventListener('show.bs.collapse', () => nav.classList.add('is-solid'));
  menu.addEventListener('hidden.bs.collapse', updateNav);

  // Close the mobile menu after choosing a link
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
    });
  });

  // 2) If an image file is missing, hide the broken icon so the colored placeholder shows
  const hideBroken = (img) => img.classList.add('is-broken');
  document.querySelectorAll('img').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) hideBroken(img);
    img.addEventListener('error', () => hideBroken(img));
  });

  // 3) Registration form: Bootstrap validation, then send (or show demo message)
  const form = document.getElementById('regForm');
  const status = document.getElementById('formStatus');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';
    status.classList.remove('is-error');

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    // Until a real Formspree ID is added, show a demo message instead of sending
    if (form.action.includes('YOUR_FORM_ID')) {
      status.textContent = 'Demo form: add your Formspree ID in index.html to receive real submissions.';
      return;
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Request failed');
      status.textContent = "Thanks! We've received your request and will email you within one business day.";
      form.reset();
      form.classList.remove('was-validated');
    } catch (error) {
      status.classList.add('is-error');
      status.textContent = 'Something went wrong. Please try again or contact us on WhatsApp.';
    }
  });

  // 4) Scroll reveal: cards and blocks fade in as they enter the screen
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    group.querySelectorAll(':scope > .reveal').forEach((el, i) => el.style.setProperty('--i', i));
  });

  const revealEls = document.querySelectorAll('.reveal');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach((el) => observer.observe(el));
  }

  // 5) Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
