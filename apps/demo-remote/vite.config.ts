import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  // Styles are injected by the components so they land in the element's shadow root.
  plugins: [svelte({ compilerOptions: { css: 'injected' } })],
  server: { port: 5174, strictPort: true },
  preview: { port: 4174, strictPort: true },
  build: {
    // Hosts load one ES module that registers <admin-app>.
    lib: { entry: 'src/main.ts', formats: ['es'], fileName: () => 'admin-app.js' }
  }
});
