import { federation } from '@module-federation/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      react(),
      federation({
        name: 'dashboard',
        remotes: {
          admin: {
            type: 'module',
            name: 'admin',
            // The remote's manifest describes its entry, exposes and chunks.
            entry: env.VITE_ADMIN_REMOTE_MANIFEST,
            entryGlobalName: 'admin',
            shareScope: 'default',
          },
        },
        // Nothing to share: the admin remote is Svelte, the host is React.
        shared: {},
        dts: false,
      }),
    ],
    server: { port: 5173, strictPort: true },
    preview: { port: 4173, strictPort: true },
    build: { target: 'esnext' },
  }
})
