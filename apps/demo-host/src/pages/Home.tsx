import { Link } from 'react-router'

export function Home() {
  return (
    <>
      <h1>Welcome back</h1>
      <p>This dashboard is a React app. The Admin section is a separate Svelte app mounted under /admin.</p>
      <ul>
        <li>
          <Link to="/admin/users/42" data-testid="host-link-user-42">
            Open Grace Hopper in Admin
          </Link>
        </li>
        <li>
          <Link to="/admin/users?role=editor" data-testid="host-link-editors">
            See all editors
          </Link>
        </li>
      </ul>
    </>
  )
}
