// Loads the admin remote's module, which registers <admin-app>. Any loader works here
// (a script tag, Module Federation, ...): the routing contract starts once the element exists.
let loading: Promise<unknown> | undefined

export function loadAdminRemote(): Promise<unknown> {
  loading ??= import(/* @vite-ignore */ import.meta.env.VITE_ADMIN_REMOTE_URL)
  return loading
}
