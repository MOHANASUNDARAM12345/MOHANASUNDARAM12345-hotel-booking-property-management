import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Local development targets the Spring Boot backend running on localhost:8080.
// Production builds use VITE_API_BASE_URL (see .env.production), which points
// at the deployed Render backend.
const DEV_API_ORIGIN =
  process.env.VITE_DEV_PROXY_TARGET || 'http://localhost:8080'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    strictPort: true,
    proxy: {
      // In local development the browser calls /api on the Vite dev server,
      // which proxies to the local Spring Boot backend. This keeps the browser
      // on a single origin, so CORS is not required for local development.
      '/api': {
        target: DEV_API_ORIGIN,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 5175,
    strictPort: true,
  },
})