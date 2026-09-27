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
    /**
     * Where the app lives when it owns the URL, e.g. `/app`. Defaults to `/`.
     * Ignored inside an app registered with defineRemote(): the host sets the base path there.
     */
    basePath?: string;
  }

  let { routes, basePath }: Props = $props();

  const existing = findRouter();
  // svelte-ignore state_referenced_locally
  const router = existing ?? createBrowserRouter({ basePath, routes });
  if (!existing) setRouterContext(router);

  // Pre-effects run once as soon as they're created, so routes are set before the first render.
  $effect.pre(() => router.setRoutes(routes));

  $effect.pre(() => {
    if (!existing) router.setBasePath(basePath);
  });

  $effect(() => {
    if (!existing) return listenToBrowser(router);
  });
</script>

<RouteLevel depth={0} />
