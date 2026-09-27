<script lang="ts">
  import Router from '../../src/components/Router.svelte';
  import { routes } from './routes.js';

  let { basePath }: { basePath?: string } = $props();
</script>

<Router {routes} {basePath} />
