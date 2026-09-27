// Loads the admin remote through Module Federation. Its exposed `register` module
// defines <admin-app>; from then on, the routing contract takes over.
let loading: Promise<unknown> | undefined

export function loadAdminRemote(): Promise<unknown> {
  loading ??= import('admin/register').catch((error: unknown) => {
    // Don't cache the failure: the next attempt (a retry, or coming back to /admin) tries again.
    loading = undefined
    throw error
  })
  return loading
}
