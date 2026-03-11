import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Proxy API calls to FastAPI backend (uncomment when backend is ready)
    // proxy: {
    //   '/api': 'http://localhost:8000',
    //   '/analyze': 'http://localhost:8000',
    // }
  }
})