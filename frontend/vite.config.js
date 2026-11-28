import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 2303,
    strictPort: true,
    // Saat development, request /api diteruskan ke backend Go.
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
})
