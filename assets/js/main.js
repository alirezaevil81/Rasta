// ==========================================================================
// Rasta App - Modern Interactive Script & SEO / GEO Enhancements
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

      const directBtn = document.getElementById('direct-apk-download-btn');
      if (directBtn) directBtn.href = downloadUrl;

      const headerBtn = document.getElementById('header-download-btn');
      if (headerBtn) headerBtn.href = downloadUrl;

      const footerBtn = document.getElementById('footer-apk-download-link');
      if (footerBtn) footerBtn.href = downloadUrl;

      const mobileDrawerBtn = document.getElementById('mobile-drawer-download-btn');
      if (mobileDrawerBtn) mobileDrawerBtn.href = downloadUrl;

      if (releaseData.tag_name) {
        const versionLabel = document.getElementById('apk-version-label');
        if (versionLabel) versionLabel.textContent = releaseData.tag_name;
      }

      if (apkAsset.size) {
        const sizeInMb = (apkAsset.size / (1024 * 1024)).toFixed(1);
        const sizeLabel = document.getElementById('apk-size-label');
        if (sizeLabel) sizeLabel.textContent = `${sizeInMb} مگابایت`;
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
    }, 400);
  }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  hidePreloader();
} else {
  document.addEventListener('DOMContentLoaded', hidePreloader);
  window.addEventListener('load', hidePreloader);
}
setTimeout(hidePreloader, 1200);

// 3. FAQ Accordion Handler
function setupFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.closest('.faq-item');
      if (!faqItem) return;
      
      const isOpen = faqItem.classList.contains('active');
      
      // Close all active items
      document.querySelectorAll('.faq-item.active').forEach(item => {
        item.classList.remove('active');
        const btn = item.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      
      // Toggle current item if it was closed
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
    const isOpen = drawer.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  const menuLinks = drawer.querySelectorAll('a');
  menuLinks.forEach(link => {
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

// 4.1 Header Scroll Elevation & ScrollSpy
function setupHeaderScrollAndSpy() {
  const header = document.getElementById('main-header');
  const desktopLinks = document.querySelectorAll('.header-menu-link');
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');
  const targetSections = document.querySelectorAll('section[id], div[id="download"]');

  function onScroll() {
    const scrollPos = window.scrollY || window.pageYOffset;
    
    // Header shadow elevation
    if (header) {
      if (scrollPos > 12) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    // Scrollspy active section detection
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
        const target = link.getAttribute('href')?.replace('#', '');
        if (target === activeId || link.dataset.section === activeId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      mobileLinks.forEach(link => {
        const target = link.getAttribute('href')?.replace('#', '');
        if (target === activeId || link.dataset.section === activeId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// 5. Interactive Live Preview Demo Switcher
function setupInteractiveDemo() {
  const habits = {
    smoking: {
      days: '۳۴',
      hours: '۱۶ ساعت و ۴۵ دقیقه',
      badgeTitle: 'مدال نقره‌ای مداومت (۳۰ روز)',
      badgeDesc: 'تبریک! بیش از یک ماه پاکی کامل ثبت شد.',
      saved: '۲,۰۴۰,۰۰۰ تومان',
      startDate: '۱۵ مرداد ۱۴۰۵'
    },
    social: {
      days: '۲۱',
      hours: '۹ ساعت و ۳۰ دقیقه',
      badgeTitle: 'مدال طلایی تمرکز ذهن (۲۱ روز)',
      badgeDesc: 'بازگشت ۶۳ ساعت زمان مفید به زندگی و کار.',
      saved: '۶۳ ساعت زمان مفید',
      startDate: '۲۸ مرداد ۱۴۰۵'
    },
    sugar: {
      days: '۵۶',
      hours: '۴ ساعت و ۱۲ دقیقه',
      badgeTitle: 'مدال الماس سلامتی (۵۰ روز)',
      badgeDesc: 'کاهش چشمگیر التهاب و قند خون بدن.',
      saved: '۱,۶۸۰,۰۰۰ تومان',
      startDate: '۲۳ تیر ۱۴۰۵'
    }
  };

  const presetButtons = document.querySelectorAll('.demo-preset-btn');
  const daysEl = document.getElementById('demo-days-count');
  const hoursEl = document.getElementById('demo-hours-count');
  const badgeTitleEl = document.getElementById('demo-badge-title');
  const badgeDescEl = document.getElementById('demo-badge-desc');
  const savedMoneyEl = document.getElementById('demo-saved-money');
  const startDateEl = document.getElementById('demo-start-date');

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const habitKey = btn.dataset.habit;
      const data = habits[habitKey];
      if (!data) return;

      if (daysEl) daysEl.textContent = data.days;
      if (hoursEl) hoursEl.textContent = data.hours;
      if (badgeTitleEl) badgeTitleEl.textContent = data.badgeTitle;
      if (badgeDescEl) badgeDescEl.textContent = data.badgeDesc;
      if (savedMoneyEl) savedMoneyEl.textContent = data.saved;
      if (startDateEl) startDateEl.textContent = data.startDate;
    });
  });
}

// 6. Interactive 4-7-8 Breathing Emergency Modal
function setupBreathingExercise() {
  const openBtn = document.getElementById('open-breathing-modal-btn');
  const modal = document.getElementById('breathing-modal');
  const closeBtn = document.getElementById('close-breathing-modal-btn');
  const actionBtn = document.getElementById('breath-action-btn');
  const actionBtnText = document.getElementById('breath-btn-text');
  const outerRing = document.getElementById('breath-outer-ring');
  const phaseText = document.getElementById('breath-phase-text');
  const phaseTimer = document.getElementById('breath-phase-timer');

  if (!modal || !openBtn) return;

  let isRunning = false;
  let timerInterval = null;
  let currentPhase = 'idle'; // 'inhale', 'hold', 'exhale'
  let secondsRemaining = 0;

  function openModal() {
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
  }

  function stopExercise() {
    isRunning = false;
    clearInterval(timerInterval);
    if (outerRing) {
      outerRing.className = 'breath-outer-ring';
    }
    if (phaseText) phaseText.textContent = 'آماده';
    if (phaseTimer) phaseTimer.textContent = '۴';
    if (actionBtnText) actionBtnText.textContent = 'شروع تمرین آرام‌سازی';
  }

  function closeModal() {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    stopExercise();
  }

  openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });

  function startExercise() {
    isRunning = true;
    if (actionBtnText) actionBtnText.textContent = 'توقف تمرین';
    runPhase('inhale');
  }

  function runPhase(phase) {
    if (!isRunning) return;
    currentPhase = phase;

    if (phase === 'inhale') {
      secondsRemaining = 4;
      if (phaseText) phaseText.textContent = 'دم عمیق...';
      if (outerRing) outerRing.className = 'breath-outer-ring phase-inhale';
    } else if (phase === 'hold') {
      secondsRemaining = 7;
      if (phaseText) phaseText.textContent = 'حبس نفس...';
      if (outerRing) outerRing.className = 'breath-outer-ring phase-hold';
    } else if (phase === 'exhale') {
      secondsRemaining = 8;
      if (phaseText) phaseText.textContent = 'بازدم آرام...';
      if (outerRing) outerRing.className = 'breath-outer-ring phase-exhale';
    }

    if (phaseTimer) phaseTimer.textContent = secondsRemaining;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (!isRunning) {
        clearInterval(timerInterval);
        return;
      }

      secondsRemaining--;
      if (secondsRemaining > 0) {
        if (phaseTimer) phaseTimer.textContent = secondsRemaining;
      } else {
        clearInterval(timerInterval);
        if (currentPhase === 'inhale') {
          runPhase('hold');
        } else if (currentPhase === 'hold') {
          runPhase('exhale');
        } else {
          runPhase('inhale');
        }
      }
    }, 1000);
  }

  if (actionBtn) {
    actionBtn.addEventListener('click', () => {
      if (isRunning) {
        stopExercise();
      } else {
        startExercise();
      }
    });
  }
}

// 7. Interactive 90-Second Urge Surfing Challenge Modal
function setupUrgeSurfingExercise() {
  const openBtn = document.getElementById('open-urge-modal-btn');
  const modal = document.getElementById('urge-modal');
  const closeBtn = document.getElementById('close-urge-modal-btn');
  const actionBtn = document.getElementById('urge-action-btn');
  const actionBtnText = document.getElementById('urge-btn-text');
  const secondsEl = document.getElementById('urge-seconds-left');
  const progressBar = document.getElementById('urge-progress-bar');
  const coachText = document.getElementById('urge-coach-text');

  if (!modal || !openBtn) return;

  let isRunning = false;
  let timerInterval = null;
  const TOTAL_SECONDS = 90;
  let secondsRemaining = TOTAL_SECONDS;

  const guidanceQuotes = [
    { at: 90, text: 'آرام بمانید؛ وسوسه فقط یک حس فیزیولوژیک گذراست، نه یک دستور برای عمل کردن.' },
    { at: 75, text: 'موج در حال شکل‌گیری است. بدون جنگیدن، با آرامش به آن نگاه کنید و از قضاوت پرهیز کنید...' },
    { at: 55, text: 'موج در بالاترین نقطه خود است؛ عضلات شانه و فک را رها کنید و عمیق نفس بکشید.' },
    { at: 35, text: 'فشار موج در حال کاهش است. مغز منطقی شما دوباره کنترل کامل را به دست گرفته است...' },
    { at: 15, text: 'تنها چند ثانیه تا ساحل آرامش باقی مانده؛ به پایداری و تعهد خود افتخار کنید.' },
    { at: 0,  text: '🌱 تبریک! ۹۰ ثانیه بحرانی به پایان رسید و شما بدون تسلیم شدن از وسوسه عبور کردید!' }
  ];

  function getQuoteForTime(sec) {
    for (const item of guidanceQuotes) {
      if (sec >= item.at) return item.text;
    }
    return guidanceQuotes[guidanceQuotes.length - 1].text;
  }

  function openModal() {
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
  }

  function stopUrge() {
    isRunning = false;
    clearInterval(timerInterval);
    secondsRemaining = TOTAL_SECONDS;
    if (secondsEl) secondsEl.textContent = '۹۰';
    if (progressBar) progressBar.style.width = '0%';
    if (coachText) coachText.textContent = guidanceQuotes[0].text;
    if (actionBtnText) actionBtnText.textContent = 'شروع چالش ۹۰ ثانیه‌ای';
  }

  function closeModal() {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    stopUrge();
  }

  openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });

  function startUrge() {
    isRunning = true;
    if (actionBtnText) actionBtnText.textContent = 'توقف و بازنشانی';

    // Optional mild haptic vibration on mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (!isRunning) {
        clearInterval(timerInterval);
        return;
      }

      secondsRemaining--;

      if (secondsEl) {
        secondsEl.textContent = secondsRemaining;
      }

      const progress = ((TOTAL_SECONDS - secondsRemaining) / TOTAL_SECONDS) * 100;
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }

      if (coachText) {
        coachText.textContent = getQuoteForTime(secondsRemaining);
      }

      if (secondsRemaining <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        if (actionBtnText) actionBtnText.textContent = 'شروع مجدد چالش';
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      }
    }, 1000);
  }

  if (actionBtn) {
    actionBtn.addEventListener('click', () => {
      if (isRunning) {
        stopUrge();
      } else {
        startUrge();
      }
    });
  }
}

// 8. Interactive HALT Checklist Modal
function setupHaltModal() {
  const openBtn = document.getElementById('open-halt-modal-btn');
  const modal = document.getElementById('halt-modal');
  const closeBtn = document.getElementById('close-halt-modal-btn');
  const cards = document.querySelectorAll('.halt-card');

  if (!modal || !openBtn) return;

  function openModal() {
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
  }

  openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });

  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-selected');
    });
  });
}

// 9. Initialize Application
function initApp() {
  fetchLatestReleaseUrl();
  setupFaqAccordion();
  setupMobileMenu();
  setupHeaderScrollAndSpy();
  setupInteractiveDemo();
  setupBreathingExercise();
  setupUrgeSurfingExercise();
  setupHaltModal();
  
  // Re-render Lucide icons for all static and dynamically added tags
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
