import { type RouterCore } from './router.svelte.js';
import type { RouteDefinition } from './matcher.js';
/** The current browser location as path + query + hash. */
export declare function browserUrl(): string;
/** Writes a navigation to browser history. Scrolls to the top on a new entry, like a page load. */
export declare function writeHistory(href: string, replace: boolean): void;
/**
 * Keeps `router` in sync with back/forward navigation. Returns a function that removes the
 * listener, so the caller controls cleanup.
 */
export declare function listenToBrowser(router: RouterCore): () => void;
/**
 * A router that owns browser history: used by a plain Svelte app, and by a remote
 * running on its own with no host.
 */
export declare function createBrowserRouter(options: {
    basePath?: string;
    routes?: RouteDefinition[];
}): RouterCore;
