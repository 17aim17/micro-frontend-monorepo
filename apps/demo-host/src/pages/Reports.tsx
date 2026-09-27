import { Link } from 'react-router'

export function Reports() {
  return (
    <>
      <h1>Reports</h1>
      <p>A page owned by the host.</p>
      <button type="button">Export</button> <Link to="/admin">Back to Admin</Link>
    </>
  )
}
