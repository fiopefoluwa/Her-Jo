import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://herjo-backend.onrender.com',
        changeOrigin: true,
        secure: true,
        headers: {
          Origin: 'http://localhost:5173',
        },
      },
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
