import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import pkg from './package.json' with { type: 'json' };

/** PWAのアイコンのサイズ */
const iconSizes = [1000, 512, 384, 192, 128, 96, 72, 48];

// https://vite.dev/config/
export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // 新しいバージョンを自動的に適用する (v1のService Workerもこれで置き換わる)
      registerType: 'autoUpdate',
      workbox: {
        navigateFallback: null,
        cleanupOutdatedCaches: true,
        // オフラインでも音源を再生できるようにキャッシュする
        globPatterns: ['**/*.{js,mjs,css,html,svg,png,ico,mp3}'],
        // OGP画像やストア用スクリーンショットはアプリの動作に不要
        globIgnores: ['ogp.png', 'pwa/sc_mobile.png'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
      manifest: {
        name: 'Campus Dashboard',
        short_name: 'CP-Dashboard',
        lang: 'ja',
        display: 'standalone',
        theme_color: '#42b3f5',
        description: 'Web上でタイマー付きの大きなデジタル時計を表示し、役に立つ情報も一目で確認できる多機能ダッシュボード。',
        icons: [
          { src: 'pwa/maskable-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
          ...iconSizes.map((size) => ({
            src: `pwa/maskable-icon@${size}px.png`,
            sizes: `${size}x${size}`,
            type: 'image/png',
            purpose: 'maskable' as const,
          })),
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          ...iconSizes.map((size) => ({
            src: `icon/icon@${size}px.png`,
            sizes: `${size}x${size}`,
            type: 'image/png',
            purpose: 'any' as const,
          })),
        ],
        screenshots: [
          { src: 'ogp.png', sizes: '2800x1660', type: 'image/png', form_factor: 'wide' },
          { src: 'pwa/sc_mobile.png', sizes: '1170x2532', type: 'image/png', form_factor: 'narrow' },
        ],
      },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  worker: {
    format: 'es',
  },
});
