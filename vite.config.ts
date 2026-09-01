import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local default `/`; GitHub Actions sets VITE_BASE_PATH to `/<repo>/`.
const base = process.env.VITE_BASE_PATH?.trim() || '/'

export default defineConfig(({ mode }) => ({
  base,
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-supabase',
              test: /node_modules[\\/]@supabase[\\/]/,
              includeDependenciesRecursively: true,
            },
          ],
        },
      },
    },
  },
  // Local-backend tests must not inherit a developer's optional cloud project.
  define:
    mode === 'test'
      ? {
          'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(''),
          'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(''),
        }
      : undefined,
}))
