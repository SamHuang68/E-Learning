import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local default `/`; GitHub Actions sets VITE_BASE_PATH to `/<repo>/`.
const base = process.env.VITE_BASE_PATH?.trim() || '/'

export default defineConfig({
  base,
  plugins: [react()],
})
