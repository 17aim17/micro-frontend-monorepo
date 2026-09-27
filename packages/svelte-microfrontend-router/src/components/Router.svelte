<!--
  Renders the route that matches the current URL.

  In a plain Svelte app it owns browser history. Inside an app registered with defineRemote()
  it uses the router the element created, which talks to the host; `basePath` is then ignored
  because the host provides it.
-->
<script lang="ts">
  import type { RouteDefinition } from '../core/matcher.js';
  import { createBrowserRouter, listenToBrowser } from '../core/browser.js';
  import { findRouter, setRouterContext } from '../context.js';
  import RouteLevel from './RouteLevel.svelte';

  interface Props {
    routes: RouteDefinition[];
    /** Where the app lives when it owns the URL, e.g. `/app`. Defaults to `/`. */
    basePath?: string;
  }

  let { routes, basePath }: Props = $props();

  const existing = findRouter();
  // svelte-ignore state_referenced_locally
  const router = existing ?? createBrowserRouter({ basePath, routes });
  if (!existing) setRouterContext(router);

  // Routes are needed before the first render, and kept in sync if the prop changes.
  // svelte-ignore state_referenced_locally
  router.setRoutes(routes);
  $effect.pre(() => router.setRoutes(routes));

  $effect(() => {
    if (!existing) return listenToBrowser(router);
  });
</script>

<RouteLevel depth={0} />
