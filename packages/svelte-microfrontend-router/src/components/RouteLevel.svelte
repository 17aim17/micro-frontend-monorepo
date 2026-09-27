<!-- Renders one level of the matched route chain. Route components at this level can render the next one with <Outlet />. -->
<script lang="ts">
  import { getRouter, setDepth } from '../context.js';

  let { depth }: { depth: number } = $props();

  const router = getRouter();
  // svelte-ignore state_referenced_locally
  setDepth(depth + 1);

  const match = $derived(router.matches[depth]);
</script>

{#if match}
  {@const Page = match.route.component}
  <Page params={match.params} />
{/if}
