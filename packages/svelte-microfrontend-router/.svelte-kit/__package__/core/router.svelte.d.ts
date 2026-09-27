import { type Params, type RouteDefinition, type RouteMatch } from './matcher.js';
export interface NavigateOptions {
    /** Replace the current history entry instead of pushing a new one. */
    replace?: boolean;
}
/**
 * Performs a navigation to a full href (base path included). This is the only way the router
 * changes the URL: in a plain app it writes to browser history, inside a host it asks the host.
 * Either way the new location comes back through `setUrl()`.
 */
export type NavigateHandler = (href: string, options: {
    replace: boolean;
}) => void;
export interface RouterOptions {
    /** Current URL: path, query and hash, e.g. `/admin/users?role=editor`. */
    url: string;
    basePath?: string;
    routes?: RouteDefinition[];
    navigate: NavigateHandler;
}
export type QueryUpdates = Record<string, string | number | boolean | null | undefined>;
/**
 * Framework-free routing state for one app. Holds the URL, base path and routes, and derives
 * everything else from them. It never touches `window` itself.
 */
export declare class RouterCore {
    #private;
    constructor(options: RouterOptions);
    /** The base path this app owns, e.g. `/admin`. `/` when the app owns the whole URL. */
    get basePath(): string;
    /** The full current URL (base included). */
    get url(): string;
    /** Current path relative to the base, e.g. `/users/42`. `null` when the URL is outside the base. */
    get path(): string | null;
    /** Params of the deepest matched route, including params from its parents. */
    get params(): Params;
    /** Current query string. Read-only: change it with `setQuery()` or `navigate()`. */
    get query(): URLSearchParams;
    /** Current hash, including `#`, or an empty string. */
    get hash(): string;
    /** The matched route chain, outermost first. Empty when nothing matches. */
    get matches(): RouteMatch[];
    get routes(): RouteDefinition[];
    /** Called whenever the location changes, from browser history or from the host. */
    setUrl(url: string): void;
    setBasePath(basePath: string | null | undefined): void;
    setRoutes(routes: RouteDefinition[]): void;
    /** Full href for a target relative to the base: `href('/users')` is `/admin/users`. */
    href(to: string): string;
    /** Navigate within this app. `to` is relative to the base and may include a query or hash. */
    navigate(to: string, options?: NavigateOptions): void;
    /** Navigate to a path owned by the host, outside this app's base path. */
    navigateHost(href: string, options?: NavigateOptions): void;
    /** Set or remove query params (`null`/`undefined` removes). Keeps the current path. */
    setQuery(updates: QueryUpdates, options?: NavigateOptions): void;
}
export declare function createRouter(options: RouterOptions): RouterCore;
