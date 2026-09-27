import { matchRoutes } from './matcher.js';
import { joinBase, normalizeBase, parseUrl, resolveTarget, stripBase } from './paths.js';
/**
 * Framework-free routing state for one app. Holds the URL, base path and routes, and derives
 * everything else from them. It never touches `window` itself.
 */
export class RouterCore {
    #url = $state('/');
    #basePath = $state('/');
    #routes = $state.raw([]);
    #navigate;
    #parts = $derived(parseUrl(this.#url));
    #path = $derived(stripBase(this.#basePath, this.#parts.pathname));
    #matches = $derived(this.#path === null ? [] : matchRoutes(this.#routes, this.#path));
    #query = $derived(new URLSearchParams(this.#parts.search));
    constructor(options) {
        this.#url = options.url;
        this.#basePath = normalizeBase(options.basePath);
        this.#routes = options.routes ?? [];
        this.#navigate = options.navigate;
    }
    /** The base path this app owns, e.g. `/admin`. `/` when the app owns the whole URL. */
    get basePath() {
        return this.#basePath;
    }
    /** The full current URL (base included). */
    get url() {
        return this.#url;
    }
    /** Current path relative to the base, e.g. `/users/42`. `null` when the URL is outside the base. */
    get path() {
        return this.#path;
    }
    /** Params of the deepest matched route, including params from its parents. */
    get params() {
        return this.#matches.at(-1)?.params ?? {};
    }
    /** Current query string. Read-only: change it with `setQuery()` or `navigate()`. */
    get query() {
        return this.#query;
    }
    /** Current hash, including `#`, or an empty string. */
    get hash() {
        return this.#parts.hash;
    }
    /** The matched route chain, outermost first. Empty when nothing matches. */
    get matches() {
        return this.#matches;
    }
    get routes() {
        return this.#routes;
    }
    /** Called whenever the location changes, from browser history or from the host. */
    setUrl(url) {
        this.#url = url;
    }
    setBasePath(basePath) {
        this.#basePath = normalizeBase(basePath);
    }
    setRoutes(routes) {
        this.#routes = routes;
    }
    /** Full href for a target relative to the base: `href('/users')` is `/admin/users`. */
    href(to) {
        const target = resolveTarget(to, this.#path ?? '/');
        return joinBase(this.#basePath, target.pathname) + target.search + target.hash;
    }
    /** Navigate within this app. `to` is relative to the base and may include a query or hash. */
    navigate(to, options = {}) {
        this.#navigate(this.href(to), { replace: options.replace ?? false });
    }
    /** Navigate to a path owned by the host, outside this app's base path. */
    navigateHost(href, options = {}) {
        this.#navigate(href, { replace: options.replace ?? false });
    }
    /** Set or remove query params (`null`/`undefined` removes). Keeps the current path. */
    setQuery(updates, options = {}) {
        const query = new URLSearchParams(this.#parts.search);
        for (const [key, value] of Object.entries(updates)) {
            if (value === null || value === undefined)
                query.delete(key);
            else
                query.set(key, String(value));
        }
        const search = query.toString();
        this.navigate((this.#path ?? '/') + (search ? `?${search}` : ''), options);
    }
}
export function createRouter(options) {
    return new RouterCore(options);
}
