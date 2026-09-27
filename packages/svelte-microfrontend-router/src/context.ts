import { createContext } from 'svelte';
import type { RouterCore } from './core/router.svelte.js';

const [getRouterContext, setRouterContext, hasRouterContext] = createContext<RouterCore>();
const [getDepthContext, setDepthContext, hasDepthContext] = createContext<number>();

export { setRouterContext };

/** The router from context, or `undefined` when there is none. */
export function findRouter(): RouterCore | undefined {
  return hasRouterContext() ? getRouterContext() : undefined;
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
  setDepthContext(depth);
}

/** How deep in the matched route chain the nearest `<Outlet />` renders. */
export function getDepth(): number {
  if (!hasDepthContext()) throw new Error('<Outlet /> must be used inside a route component rendered by <Router>.');
  return getDepthContext();
}
