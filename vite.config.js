import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const COOP_HEADERS = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'credentialless',
}

// https://vite.dev/config/
export default defineConfig({
  base: '/nyayasetu-app/',
  plugins: [react()],
  // Required to serve .wasm files correctly
  assetsInclude: ['**/*.wasm'],
  server: {
    headers: COOP_HEADERS,
  },
  preview: {
    headers: COOP_HEADERS,
  },
  optimizeDeps: {
    // Exclude heavy WASM packages from pre-bundling
    exclude: ['@runanywhere/web', 'onnxruntime-web'],
  },
})
