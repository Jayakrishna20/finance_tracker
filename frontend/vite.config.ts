import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group React-related packages
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // Group MUI packages separately as they are quite large
            if (id.includes('@mui')) {
              return 'mui-vendor';
            }
            // Recharts also tends to be large
            if (id.includes('recharts')) {
              return 'recharts-vendor';
            }
            // Everything else falls into the general vendor chunk
            return 'vendor';
          }
        }
      }
    }
  }
})
