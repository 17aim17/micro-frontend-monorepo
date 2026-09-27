import { getContext, hasContext, setContext } from 'svelte';
import type { RouterCore } from './core/router.svelte.js';

/** Context key for the app's router. `defineRemote` passes it to `mount()`. */
export const ROUTER_KEY = Symbol('svelte-microfrontend-router');
const DEPTH_KEY = Symbol('svelte-microfrontend-router/depth');

export function setRouterContext(router: RouterCore): void {
  setContext(ROUTER_KEY, router);
}

/** The router from context, or `undefined` when there is none. */
export function findRouter(): RouterCore | undefined {
  return hasContext(ROUTER_KEY) ? getContext<RouterCore>(ROUTER_KEY) : undefined;
}

/**
 * The router for this app. Call it in a component's `<script>`, inside a `<Router>`
 * or an app registered with `defineRemote()`.
 */
export function getRouter(): RouterCore {
  const router = findRouter();
  if (!router) {
    throw new Error('getRouter() must be called in a component inside <Router> or an app registered with defineRemote().');
  }
  return router;
}

export function setDepth(depth: number): void {
  setContext(DEPTH_KEY, depth);
}

/** How deep in the matched route chain the nearest `<Outlet />` renders. */
export function getDepth(): number {
  const depth = getContext<number | undefined>(DEPTH_KEY);
  if (depth === undefined) throw new Error('<Outlet /> must be used inside a route component rendered by <Router>.');
  return depth;
}
