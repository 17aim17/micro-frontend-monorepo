import { Link } from 'react-router'

export function NotFound() {
  return (
    <>
      <h1>Not found</h1>
      <p>
        The dashboard has no page here. <Link to="/">Go home</Link>
      </p>
    </>
  )
}
