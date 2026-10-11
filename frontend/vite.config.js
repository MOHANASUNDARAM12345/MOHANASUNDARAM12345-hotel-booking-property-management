import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Deployed Spring Boot API on Render.
const RENDER_API_ORIGIN = 'https://mohanasundaram12345-hotel-booking-v844.onrender.com'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    strictPort: true,
    proxy: {
      // In local development the browser calls /api on the Vite dev server,
      // which proxies to Render. This is same-origin from the browser's
      // perspective, so it works even before CORS is configured on the API.
      '/api': {
        target: RENDER_API_ORIGIN,
        changeOrigin: true,
        secure: true,
        // The browser sends an Origin header even for same-origin POSTs.
        // Strip it before forwarding so the API's CORS filter never rejects
        // local development traffic while the allowlist is being configured.
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin')
          })
        },
      },
    },
  },
  preview: {
    port: 5175,
    strictPort: true,
  },
})
