import { NavLink, Outlet, Route, Routes, useLocation } from 'react-router'
import { AdminRoute } from './AdminRoute.tsx'
import { Home } from './pages/Home.tsx'
import { NotFound } from './pages/NotFound.tsx'
import { Reports } from './pages/Reports.tsx'

function Layout() {
  const location = useLocation()

  return (
    <div className="shell">
      <aside>
        <p className="brand">Dashboard</p>
        <nav>
          <NavLink to="/" end data-testid="host-nav-home">
            Home
          </NavLink>
          <NavLink to="/reports" data-testid="host-nav-reports">
            Reports
          </NavLink>
          <NavLink to="/admin" data-testid="host-nav-admin">
            Admin
          </NavLink>
        </nav>
      </aside>
      <div className="content">
        <p className="host-location">
          Host router location: <code data-testid="host-location">{location.pathname + location.search}</code>
        </p>
        <Outlet />
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="reports" element={<Reports />} />
        {/* Everything under /admin belongs to the admin remote. */}
        <Route path="admin/*" element={<AdminRoute />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
