import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://infantajayvenus.github.io/GymBooku/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,svg,png}", "manifest.webmanifest"],
        globIgnores: ["**/*-legacy-*.js"],
        runtimeCaching: [
          {
            urlPattern: /https:\/\/[a-zA-Z./0-9_]*\.(?:otf|ttf)/i,
            handler: "CacheFirst",
            options: {
              cacheName: "fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: "Gymbooku",
        short_name: "Gymbooku",
        background_color: "#000000",
        theme_color: "#fa4b4b",
        icons: [
          { src: "./calendar-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "./calendar-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "./calendar-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "./calendar-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
    react(),
  ],
  resolve: {
    alias: [
      {
        find: /^src\/(.*)/,
        replacement: resolve(__dirname, './src/$1'),
      },
    ]
  }
})
