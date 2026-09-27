import type { RouterCore } from './core/router.svelte.js';
/** Context key for the app's router. `defineRemote` passes it to `mount()`. */
export declare const ROUTER_KEY: unique symbol;
export declare function setRouterContext(router: RouterCore): void;
/** The router from context, or `undefined` when there is none. */
export declare function findRouter(): RouterCore | undefined;
/**
 * The router for this app. Call it in a component's `<script>`, inside a `<Router>`
 * or an app registered with `defineRemote()`.
 */
export declare function getRouter(): RouterCore;
export declare function setDepth(depth: number): void;
/** How deep in the matched route chain the nearest `<Outlet />` renders. */
export declare function getDepth(): number;
