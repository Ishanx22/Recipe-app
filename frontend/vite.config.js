import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'], // ✅ Important to prevent duplicate React copies
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // your backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
