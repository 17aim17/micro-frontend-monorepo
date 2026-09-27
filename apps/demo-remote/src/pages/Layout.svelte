<script lang="ts">
  import { getRouter, Link, Outlet } from 'svelte-microfrontend-router';

  const router = getRouter();
</script>

<div class="admin">
  <header>
    <strong>Admin</strong>
    <nav>
      <Link to="/" data-testid="remote-nav-overview">Overview</Link>
      <Link to="/users" data-testid="remote-nav-users">Users</Link>
    </nav>
    <button type="button" data-testid="remote-to-reports" onclick={() => router.navigateHost('/reports')}>
      Open reports
    </button>
  </header>
  <main>
    <Outlet />
  </main>
</div>

<style>
  .admin {
    font-family: system-ui, sans-serif;
    color: #1f2933;
    border: 1px solid #d9dee4;
    border-radius: 8px;
    overflow: hidden;
  }

  header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    background: #f4f1fb;
    border-bottom: 1px solid #d9dee4;
  }

  nav {
    display: flex;
    gap: 12px;
    flex: 1;
  }

  nav :global(a) {
    color: #5b3cc4;
    text-decoration: none;
  }

  nav :global(a[aria-current='page']) {
    font-weight: 600;
    text-decoration: underline;
  }

  button {
    font: inherit;
    padding: 4px 10px;
    border: 1px solid #5b3cc4;
    border-radius: 6px;
    background: white;
    color: #5b3cc4;
    cursor: pointer;
  }

  main {
    padding: 16px;
  }
</style>
