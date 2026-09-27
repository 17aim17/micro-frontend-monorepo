import { federation } from '@module-federation/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    // Styles are injected by the components so they land in the element's shadow root.
    svelte({ compilerOptions: { css: 'injected' } }),
    federation({
      name: 'admin',
      filename: 'remoteEntry.js',
      // Loading this module registers <admin-app>. Nothing is shared: the host is React.
      exposes: { './register': './src/main.ts' },
      shared: {},
      // The exposed module has no exports to type.
      dts: false
    })
  ],
  server: { port: 5174, strictPort: true, origin: 'http://localhost:5174' },
  preview: { port: 4174, strictPort: true },
  build: { target: 'esnext' }
});
