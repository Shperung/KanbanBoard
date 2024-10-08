import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {VitePWA} from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      workbox: {
        globPatterns: ['**/*'],
      },
      includeAssets: ['**/*'],
      manifest: {
        theme_color: '#4c5257',
        background_color: '#4c5257',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        short_name: 'Kanban Board',
        description: 'Kanban Board',
        name: 'Kanban Board',
        screenshots: [
          {
            src: '/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Kanban Board',
          },
          {
            src: '/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Kanban Board',
          },
        ],
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: '/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
