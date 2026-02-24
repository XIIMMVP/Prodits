import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-light-192.png', 'icon-light-512.png', 'apple-touch-icon-light.png'],
      manifest: {
        name: 'Prodits - Tu Gestor de Hábitos',
        short_name: 'Prodits',
        description: 'Tu gestor de hábitos profesional con diseño premium.',
        theme_color: '#FBFBFD',
        background_color: '#FBFBFD',
        display: 'standalone',
        icons: [
          {
            src: 'icon-light-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-light-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icon-light-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
