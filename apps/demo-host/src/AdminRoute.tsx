import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { loadAdminRemote } from './loadAdminRemote.ts'

interface MfeNavigateDetail {
  href: string
  replace: boolean
}

/**
 * The whole host-side integration. The host hands the remote everything under /admin:
 * it passes the current URL down, and routes the remote's navigation requests through
 * React Router, so both routers always agree on the URL.
 */
export function AdminRoute() {
  const location = useLocation()
  const navigate = useNavigate()
  const ref = useRef<HTMLElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    loadAdminRemote().catch(() => setFailed(true))
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const onNavigate = (event: Event) => {
      event.preventDefault()
      const { href, replace } = (event as CustomEvent<MfeNavigateDetail>).detail
      navigate(href, { replace })
    }
    element.addEventListener('mfe-navigate', onNavigate)
    return () => element.removeEventListener('mfe-navigate', onNavigate)
  }, [navigate])

  if (failed) {
    return (
      <p role="alert" className="remote-error">
        The admin app is unavailable right now.
      </p>
    )
  }

  return <admin-app ref={ref} base-path="/admin" url={location.pathname + location.search + location.hash} />
}
