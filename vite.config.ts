import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa';
import {resolve} from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({registerType: 'autoUpdate'}),
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
