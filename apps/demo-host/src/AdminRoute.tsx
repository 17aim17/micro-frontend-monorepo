import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import type { MfeNavigateDetail } from './custom-elements'
import { loadAdminRemote } from './loadAdminRemote.ts'

type Status = 'loading' | 'ready' | 'failed'

/**
 * The whole host-side integration. The host hands the remote everything under /admin:
 * it passes the current URL down, and routes the remote's navigation requests through
 * React Router, so both routers always agree on the URL.
 *
 * If the remote can't be loaded, the host still owns /admin: the URL stays, host navigation
 * keeps working, and the user can retry (or come back later, which retries too).
 */
export function AdminRoute() {
  const location = useLocation()
  const navigate = useNavigate()
  const [status, setStatus] = useState<Status>(() => (customElements.get('admin-app') ? 'ready' : 'loading'))
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let current = true
    loadAdminRemote().then(
      () => current && setStatus('ready'),
      (error: unknown) => {
        console.error('Could not load the admin remote', error)
        if (current) setStatus('failed')
      },
    )
    return () => {
      current = false
    }
  }, [attempt])

  // React 19 attaches this as a native listener before the element is inserted,
  // so even a navigation the remote makes while mounting reaches React Router.
  const onNavigate = (event: CustomEvent<MfeNavigateDetail>) => {
    event.preventDefault()
    const { href, replace } = event.detail
    if (href.startsWith('/') && !href.startsWith('//')) navigate(href, { replace })
    else window.location.assign(href) // Not a path in this app: leave with a full page load.
  }

  if (status === 'failed') {
    return (
      <div role="alert" className="remote-error">
        <p>The admin app couldn't be loaded.</p>
        <button
          type="button"
          onClick={() => {
            setStatus('loading')
            setAttempt((count) => count + 1)
          }}
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <>
      {status === 'loading' && <p className="remote-loading">Loading admin…</p>}
      <admin-app
        base-path="/admin"
        url={location.pathname + location.search + location.hash}
        onmfe-navigate={onNavigate}
      />
    </>
  )
}
