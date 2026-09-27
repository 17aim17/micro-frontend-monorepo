import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Injected CSS lets tests check that styles land in the shadow root.
  plugins: [svelte({ compilerOptions: { css: 'injected' } })],
  // Use Svelte's browser build so components can be mounted in jsdom tests.
  resolve: { conditions: ['browser'] },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node'
  }
});
