// Tailwind Configuration
if (window.tailwind) {
  window.tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          sans: ['Vazirmatn', 'sans-serif'],
        },
        colors: {
          brand: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
            950: '#052e16',
          },
          logoLime: {
            300: '#bef264',
            400: '#a3e635',
            500: '#84cc16',
            600: '#65a30d',
          }
        }
      }
    }
  };
}

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

// Run on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fetchLatestReleaseUrl);
} else {
  fetchLatestReleaseUrl();
}
