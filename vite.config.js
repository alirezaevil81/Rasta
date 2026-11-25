import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, existsSync, mkdirSync } from 'fs';

function copyRootSeoFiles() {
  const staticRootFiles = ['sitemap.xml', 'robots.txt', 'llms.txt', 'site.webmanifest', 'favicon.ico'];
  return {
    name: 'copy-root-seo-files',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist');
      if (!existsSync(distDir)) {
        mkdirSync(distDir, { recursive: true });
      }
      for (const file of staticRootFiles) {
        const src = resolve(__dirname, file);
        if (existsSync(src)) {
          copyFileSync(src, resolve(distDir, file));
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [copyRootSeoFiles()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        roozshomarShamsi: resolve(__dirname, 'roozshomar-shamsi.html'),
        tarkSigar: resolve(__dirname, 'tark-sigar.html'),
        tarkFazaMajazi: resolve(__dirname, 'tark-faza-majazi.html'),
        maharVasvaseh: resolve(__dirname, 'mahar-vasvaseh.html'),
        amniatOffline: resolve(__dirname, 'amniat-offline.html'),
        tarkGhandPorkhori: resolve(__dirname, 'tark-ghand-porkhori.html'),
        tarkGaming: resolve(__dirname, 'tark-gaming.html'),
        behtarinAppTarkAdat: resolve(__dirname, 'behtarin-app-tark-adat.html'),
        rahnamaTarkAdat: resolve(__dirname, 'rahnama-tark-adat.html'),
        rastaDarIran: resolve(__dirname, 'rasta-dar-iran.html'),
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
});
