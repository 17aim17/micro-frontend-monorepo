import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      // <admin-app> is the Svelte remote's custom element, not a Vue component.
      template: { compilerOptions: { isCustomElement: (tag) => tag === 'admin-app' } },
    }),
  ],
  server: { port: 5175, strictPort: true },
  preview: { port: 4175, strictPort: true },
})
