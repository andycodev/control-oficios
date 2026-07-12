import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,pdf}'] // Añadimos .pdf para cachear tus plantillas base
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Control de Oficios',
        short_name: 'CO Control',
        description: 'Sistema de control y emisión de oficios institucionales',
        theme_color: '#006b54', // Ajustado a tu Verde Jade institucional
        background_color: '#f8fafc', // Ajustado a un gris/slate muy suave de fondo
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
    host: '0.0.0.0', // Forzar explícitamente a escuchar en todas las interfaces de red locales
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0', // También habilitado para el modo preview de producción local
    port: 8080,      // Cambiamos el puerto de preview para evitar conflictos si el dev server sigue corriendo
    strictPort: true,
  }
})