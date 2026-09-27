import { createRouter } from './router.svelte.js';
/** The current browser location as path + query + hash. */
export function browserUrl() {
    return window.location.pathname + window.location.search + window.location.hash;
}
/** Writes a navigation to browser history. Scrolls to the top on a new entry, like a page load. */
export function writeHistory(href, replace) {
    if (replace)
        window.history.replaceState(window.history.state, '', href);
    else {
        window.history.pushState(null, '', href);
        window.scrollTo(0, 0);
    }
}
/**
 * Keeps `router` in sync with back/forward navigation. Returns a function that removes the
 * listener, so the caller controls cleanup.
 */
export function listenToBrowser(router) {
    const onPopState = () => router.setUrl(browserUrl());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
}
/**
 * A router that owns browser history: used by a plain Svelte app, and by a remote
 * running on its own with no host.
 */
export function createBrowserRouter(options) {
    const navigate = (href, { replace }) => {
        writeHistory(href, replace);
        router.setUrl(browserUrl());
    };
    const router = createRouter({ ...options, url: browserUrl(), navigate });
    return router;
}
