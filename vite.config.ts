import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages project site: https://letrinhandn.github.io/letrinhan-site/
export default defineConfig({
  base: '/letrinhan-site/',
  plugins: [react()],
})
