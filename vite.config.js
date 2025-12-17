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
      manifestFilename: 'manifest.json',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
        maximumFileSizeToCacheInBytes: 3000000
      },
      includeAssets: ['favicon.ico'],
      manifest: {
        id: '/',
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
            src: 'logo_upscaled_16.png',
            sizes: '16x16',
            type: 'image/png'
          },
          {
            src: 'logo_upscaled_32.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: 'logo_upscaled_64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'logo_upscaled_192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo_upscaled_512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        screenshots: [
          {
            src: "screenshots/home-wide.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
            label: "Home"
          },
          {
            src: "screenshots/home-narrow.png",
            sizes: "720x1280",
            type: "image/png",
            form_factor: "narrow",
            label: "Home"
          }
        ]
      }
    })
  ],
})
