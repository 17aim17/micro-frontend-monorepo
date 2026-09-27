import { createInstance, type ModuleFederation } from '@module-federation/runtime'

// The admin remote is registered at runtime, on the first visit to /admin, rather than in the
// build config. That way the dashboard renders right away, and a slow or broken remote only
// affects the /admin section instead of blanking the whole page.
let federation: ModuleFederation | undefined
let loading: Promise<unknown> | undefined

function getFederation(): ModuleFederation {
  const entry = import.meta.env.VITE_ADMIN_REMOTE_MANIFEST
  if (!entry) throw new Error('VITE_ADMIN_REMOTE_MANIFEST is not set, so the admin remote cannot be loaded.')
  federation ??= createInstance({ name: 'dashboard_vue', remotes: [{ name: 'admin', entry }] })
  return federation
}

/** Loads the remote's exposed `register` module, which defines <admin-app>. */
export function loadAdminRemote(): Promise<unknown> {
  loading ??= Promise.resolve()
    .then(() => getFederation().loadRemote('admin/register'))
    .catch((error: unknown) => {
      // Don't cache the failure: the next attempt (a retry, or coming back to /admin) tries again.
      loading = undefined
      throw error
    })
  return loading
}
