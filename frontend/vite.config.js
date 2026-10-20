import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Tailwind v4: use @tailwindcss/vite plugin instead of postcss
export default defineConfig({
  plugins: [
    tailwindcss(),  // Tailwind v4 vite plugin [SPEC: remove postcss.config.js, use this instead]
    react(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
