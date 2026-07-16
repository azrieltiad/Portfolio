const body = document.body;
const loadingScreen = document.getElementById('loading-screen');
const progressBar = document.querySelector('.scroll-progress');
const backToTop = document.getElementById('back-to-top');
const sidebar = document.querySelector('.sidebar');
const menuToggle = document.getElementById('mobile-menu-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('theme-toggle');
const typingEl = document.querySelector('.typing');
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const copyEmail = document.getElementById('copy-email');
const pageTransition = document.querySelector('.page-transition');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initLoading() {
  if (!loadingScreen) return;
  window.setTimeout(() => {
    loadingScreen.classList.add('hidden');
    if (pageTransition) {
      pageTransition.classList.add('active');
      setTimeout(() => pageTransition.classList.remove('active'), 350);
    }
  }, 1100);
}

function updateScrollProgress() {
  if (!progressBar) return;
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? scrollTop / height : 0;
  progressBar.style.transform = `scaleX(${progress})`;
  if (backToTop) {
    backToTop.classList.toggle('visible', scrollTop > 700);
  }
}

function initRevealOnScroll() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((element) => observer.observe(element));
}

function setActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach((link) => {
    const hrefPath = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', hrefPath === currentPath || (hrefPath === 'index.html' && currentPath === ''));
  });
}

function initTypingEffect() {
  if (!typingEl || prefersReducedMotion) return;
  const phrases = JSON.parse(typingEl.dataset.typing || '[]');
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    const current = phrases[phraseIndex] || '';
    typingEl.textContent = current.slice(0, charIndex);

    if (!deleting && charIndex < current.length) {
      charIndex += 1;
    } else if (!deleting && charIndex === current.length) {
      deleting = true;
      setTimeout(type, 1200);
      return;
    } else if (deleting && charIndex > 0) {
      charIndex -= 1;
    } else {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }

    setTimeout(type, deleting ? 45 : 85);
  };

  type();
}

function initMobileMenu() {
  if (!menuToggle) return;

  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      sidebar.classList.remove('open');
    }
  });
}

function initThemeToggle() {
  if (!themeToggle) return;
  const stored = localStorage.getItem('theme');
  if (stored === 'light') {
    body.classList.add('light-theme');
    themeToggle.textContent = 'Theme: Light';
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    themeToggle.textContent = `Theme: ${isLight ? 'Light' : 'Dark'}`;
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

function initCurrentTime() {
  const clock = document.getElementById('current-time');
  if (!clock) return;
  const update = () => {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  update();
  setInterval(update, 1000);
}

function initVisitorCounter() {
  const counter = document.getElementById('visitor-count');
  if (!counter) return;
  const stored = Number(localStorage.getItem('visitor-count') || 0);
  const next = stored + 1;
  localStorage.setItem('visitor-count', String(next));
  counter.textContent = next;
}

function initCopyEmail() {
  if (!copyEmail) return;
  copyEmail.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('azriel.tiad@email.com');
      copyEmail.innerHTML = '<span>Copied</span>';
      setTimeout(() => {
        copyEmail.innerHTML = '<span>azriel.tiad@email.com</span><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 8h12v12H8z"/><path d="M4 4h12v12"/></svg>';
      }, 1200);
    } catch (error) {
      copyEmail.innerHTML = '<span>Copy failed</span>';
    }
  });
}

function initForm() {
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    formStatus.textContent = `Thanks, ${name || 'there'} — your note is queued for a reply.`;
    form.reset();
  });
}

function initKeyboardNav() {
  document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'm') {
      sidebar.classList.toggle('open');
    }
    if (event.key.toLowerCase() === 'h') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (event.key.toLowerCase() === 'c') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

function initBackToTop() {
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

window.addEventListener('scroll', () => {
  updateScrollProgress();
  setActiveNav();
});

window.addEventListener('load', () => {
  initLoading();
  initRevealOnScroll();
  initTypingEffect();
  initCurrentTime();
  initVisitorCounter();
  initCopyEmail();
  initForm();
  initKeyboardNav();
  initBackToTop();
  initMobileMenu();
  initThemeToggle();
  updateScrollProgress();
  setActiveNav();
});
