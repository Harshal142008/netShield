import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  // GitHub Pages serves this project from /netShield/ rather than the domain root.
  base: '/netShield/',
  plugins: [react()],
})
