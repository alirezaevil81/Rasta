// ==========================================================================
// Rasta App - Minimal Showcase Script & Multi-Page Enhancement
// ==========================================================================

// 1. GitHub Latest Release Sync
async function fetchLatestReleaseUrl() {
  const repoOwner = 'alirezaevil81';
  const repoName = 'Rasta';
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) return;

    const releaseData = await res.json();
    if (!releaseData || !releaseData.assets) return;

    const apkAsset = releaseData.assets.find(asset =>
      asset.name && asset.name.toLowerCase().endsWith('.apk')
    );

    if (apkAsset && apkAsset.browser_download_url) {
      const downloadUrl = apkAsset.browser_download_url;

      const apkLinkIds = [
        'direct-apk-download-btn',
        'header-download-btn',
        'footer-apk-download-link',
        'mobile-drawer-download-btn',
        'subpage-apk-download-btn',
      ];

      apkLinkIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.href = downloadUrl;
      });

      if (releaseData.tag_name) {
        const versionLabel = document.getElementById('apk-version-label');
        if (versionLabel) versionLabel.textContent = releaseData.tag_name;
      }

      if (apkAsset.size) {
        const sizeInMb = (apkAsset.size / (1024 * 1024)).toFixed(1);
        const sizeLabel = document.getElementById('apk-size-label');
        if (sizeLabel) sizeLabel.textContent = `${toPersianDigits(sizeInMb)} مگابایت`;
      }
    }
  } catch (e) {
    console.warn('Unable to fetch latest release from GitHub API:', e);
  }
}

// 2. Preloader Handler
let preloaderHidden = false;
function hidePreloader() {
  if (preloaderHidden) return;
  preloaderHidden = true;
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.opacity = '0';
    preloader.style.pointerEvents = 'none';
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 350);
  }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  hidePreloader();
} else {
  document.addEventListener('DOMContentLoaded', hidePreloader);
  window.addEventListener('load', hidePreloader);
}
setTimeout(hidePreloader, 1000);

// 3. FAQ Accordion Handler
function setupFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  if (!faqQuestions.length) return;

  faqQuestions.forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.closest('.faq-item');
      if (!faqItem) return;

      const isOpen = faqItem.classList.contains('active');

      document.querySelectorAll('.faq-item.active').forEach(item => {
        item.classList.remove('active');
        const btn = item.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        faqItem.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// 4. Mobile Navigation Drawer Handler
function setupMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-menu-drawer');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  if (!toggleBtn || !drawer) return;

  function openMenu() {
    toggleBtn.classList.add('is-active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (backdrop) backdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggleBtn.classList.remove('is-active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (backdrop) backdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && drawer.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

// 5. Header Scroll Elevation & ScrollSpy
function setupHeaderScrollAndSpy() {
  const header = document.getElementById('main-header');
  const desktopLinks = document.querySelectorAll('.header-menu-link');
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');
  const targetSections = document.querySelectorAll('main[id], section[id]');

  function onScroll() {
    const scrollPos = window.scrollY || window.pageYOffset;

    if (header) {
      if (scrollPos > 12) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    if (!targetSections.length) return;

    let activeId = '';
    const offset = 140;
    targetSections.forEach(section => {
      const top = section.offsetTop - offset;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        activeId = section.getAttribute('id');
      }
    });

    if (activeId) {
      desktopLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const target = href.startsWith('#') ? href.slice(1) : '';
        if (target && (target === activeId || link.dataset.section === activeId)) {
          link.classList.add('active');
        } else if (target) {
          link.classList.remove('active');
        }
      });

      mobileLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const target = href.startsWith('#') ? href.slice(1) : '';
        if (target && (target === activeId || link.dataset.section === activeId)) {
          link.classList.add('active');
        } else if (target) {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// 6. Persian Digit Formatter Utility
function toPersianDigits(num) {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, (d) => farsiDigits[d]);
}

// 7. Scroll Reveal Animation Engine
function setupScrollReveal() {
  const revealSelectors = [
    '.hero-kicker',
    '.hero-logo-wrapper',
    '.hero-title',
    '.hero-subtitle',
    '.download-wrapper',
    '.download-trust-row',
    '.section-header-centered',
    '.geofact-card',
    '.feature-card',
    '.quick-highlights-box',
    '.topic-directory-box',
    '.reviews-summary-card',
    '.review-card',
    '.faq-item',
    '.subpage-hero-card',
    '.geo-answer-box',
    '.topic-detail-card',
    '.subpage-cta-band',
    '.related-topic-card',
    '.footer-container',
  ];

  const revealTargets = document.querySelectorAll(revealSelectors.join(', '));
  if (!revealTargets.length) return;

  revealTargets.forEach(el => {
    el.classList.add('reveal-on-scroll');

    const parent = el.parentElement;
    if (parent && (
      parent.classList.contains('features-bento-grid') ||
      parent.classList.contains('geofacts-container') ||
      parent.classList.contains('download-grid') ||
      parent.classList.contains('reviews-grid') ||
      parent.classList.contains('topic-detail-grid') ||
      parent.classList.contains('related-topics-grid')
    )) {
      const childIndex = Array.from(parent.children).indexOf(el);
      if (childIndex >= 0) {
        el.style.transitionDelay = `${(childIndex % 4) * 65}ms`;
      }
    }
  });

  if (!('IntersectionObserver' in window)) {
    revealTargets.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.06,
    rootMargin: '0px 0px -24px 0px',
  });

  revealTargets.forEach(el => observer.observe(el));
}

// 8. IFrame Embedding Compatibility & Parent Messaging
function setupIframeCompatibility() {
  const isEmbedded = window.self !== window.top;

  if (isEmbedded) {
    document.documentElement.classList.add('is-embedded');
    document.body.classList.add('is-embedded');
  }

  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('market://') ||
      href.startsWith('tel:') ||
      href.startsWith('mailto:')
    ) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  if (isEmbedded) {
    function notifyParentHeight() {
      try {
        const height = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight
        );
        window.parent.postMessage({ type: 'rasta:resize', height }, '*');
      } catch (e) {
        // Ignore cross-origin postMessage errors
      }
    }

    window.addEventListener('load', notifyParentHeight);
    window.addEventListener('resize', notifyParentHeight, { passive: true });

    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => notifyParentHeight());
      ro.observe(document.body);
    }

    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'rasta:query_height') {
        notifyParentHeight();
      } else if (e.data && e.data.type === 'rasta:scroll_to' && typeof e.data.target === 'string') {
        const targetEl = document.querySelector(e.data.target);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}

// 9. Initialize Application
function initApp() {
  fetchLatestReleaseUrl();
  setupFaqAccordion();
  setupMobileMenu();
  setupHeaderScrollAndSpy();
  setupScrollReveal();
  setupIframeCompatibility();

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
