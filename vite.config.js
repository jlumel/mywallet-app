import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteMinifyPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
        maximumFileSizeToCacheInBytes: 3000000
      },
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'My Wallet',
        short_name: 'My Wallet',
        description: 'Personal Budget Manager',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'logo.png',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/png'
          },
          {
            src: 'logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
