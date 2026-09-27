<script lang="ts">
  import { getRouter, Link } from 'svelte-microfrontend-router';

  const router = getRouter();
</script>

<h1>Page not found</h1>
<p>Nothing in the admin app at <code>{router.path}</code>.</p>
<Link to="/">Go to overview</Link>
