import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Bean-paste-drawing-generator/',
  build: {
    outDir: 'dist',
  },
})
