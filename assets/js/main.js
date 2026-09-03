// GitHub Latest Release Sync
async function fetchLatestReleaseUrl() {
  const repoOwner = 'alirezaevil81';
  const repoName = 'Rasta';
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) return;

    const releaseData = await res.json();
    if (!releaseData || !releaseData.assets) return;

    // Find the asset that ends with .apk (case-insensitive)
    const apkAsset = releaseData.assets.find(asset => 
      asset.name && asset.name.toLowerCase().endsWith('.apk')
    );

    if (apkAsset && apkAsset.browser_download_url) {
      const downloadUrl = apkAsset.browser_download_url;

      // Update Direct APK download button in main hero section
      const directBtn = document.getElementById('direct-apk-download-btn');
      if (directBtn) directBtn.href = downloadUrl;

      // Update Direct APK download button in header if present
      const headerBtn = document.getElementById('header-download-btn');
      if (headerBtn) headerBtn.href = downloadUrl;

      // Update Footer download link
      const footerBtn = document.getElementById('footer-apk-download-link');
      if (footerBtn) footerBtn.href = downloadUrl;

      // Update Version label if tagName exists
      if (releaseData.tag_name) {
        const versionLabel = document.getElementById('apk-version-label');
        if (versionLabel) versionLabel.textContent = releaseData.tag_name;
      }

      // Update File size if present
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

// Preloader Handler
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.opacity = '0';
    preloader.style.pointerEvents = 'none';
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }
}

// Hide preloader strictly when window and all assets are fully loaded
if (document.readyState === 'complete') {
  hidePreloader();
} else {
  window.addEventListener('load', hidePreloader);
}

// FAQ Accordion Handler
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

// Run on DOM load for release fetching & FAQ accordion
function initApp() {
  fetchLatestReleaseUrl();
  setupFaqAccordion();
  
  // Initialize Lucide SVG Icons from CDN
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

