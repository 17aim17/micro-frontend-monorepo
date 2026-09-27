<!-- Renders the next nested route. Use it inside a route component that has `children`. -->
<script lang="ts">
  import { getDepth } from '../context.js';
  import RouteLevel from './RouteLevel.svelte';

  const depth = getDepth();
</script>

<RouteLevel {depth} />
