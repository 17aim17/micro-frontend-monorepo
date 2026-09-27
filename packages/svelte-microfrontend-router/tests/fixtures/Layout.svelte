<script lang="ts">
  import Link from '../../src/components/Link.svelte';
  import Outlet from '../../src/components/Outlet.svelte';
  import { getRouter } from '../../src/context.js';

  const router = getRouter();
</script>

<nav>
  <Link to="/" data-testid="home">Home</Link>
  <Link to="/users/42" data-testid="user-42">User 42</Link>
  <Link to="https://svelte.dev" data-testid="external">Svelte</Link>
  <button data-testid="reports" onclick={() => router.navigateHost('/reports')}>Reports</button>
</nav>
<Outlet />

<style>
  nav {
    color: rgb(255, 0, 0);
  }
</style>
