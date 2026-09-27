import { matchRoutes, type Params, type RouteDefinition, type RouteMatch } from './matcher.js';
import { joinBase, normalizeBase, parseUrl, resolveTarget, stripBase } from './paths.js';

export interface NavigateOptions {
  /** Replace the current history entry instead of pushing a new one. */
  replace?: boolean;
}

/**
 * Performs a navigation to a full href (base path included). This is the only way the router
 * changes the URL: in a plain app it writes to browser history, inside a host it asks the host.
 * Either way the new location comes back through `setUrl()`.
 */
export type NavigateHandler = (href: string, options: { replace: boolean }) => void;

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
export class RouterCore {
  #url = $state('/');
  #basePath = $state('/');
  #routes = $state.raw<RouteDefinition[]>([]);
  #navigate: NavigateHandler;

  #parts = $derived(parseUrl(this.#url));
  #path = $derived(stripBase(this.#basePath, this.#parts.pathname));
  #matches = $derived(this.#path === null ? [] : matchRoutes(this.#routes, this.#path));
  #query = $derived(new URLSearchParams(this.#parts.search));

  constructor(options: RouterOptions) {
    this.#url = options.url;
    this.#basePath = normalizeBase(options.basePath);
    this.#routes = options.routes ?? [];
    this.#navigate = options.navigate;
  }

  /** The base path this app owns, e.g. `/admin`. `/` when the app owns the whole URL. */
  get basePath(): string {
    return this.#basePath;
  }

  /** The full current URL (base included). */
  get url(): string {
    return this.#url;
  }

  /** Current path relative to the base, e.g. `/users/42`. `null` when the URL is outside the base. */
  get path(): string | null {
    return this.#path;
  }

  /** Params of the deepest matched route, including params from its parents. */
  get params(): Params {
    return this.#matches.at(-1)?.params ?? {};
  }

  /** Current query string. Read-only: change it with `setQuery()` or `navigate()`. */
  get query(): URLSearchParams {
    return this.#query;
  }

  /** Current hash, including `#`, or an empty string. */
  get hash(): string {
    return this.#parts.hash;
  }

  /** The matched route chain, outermost first. Empty when nothing matches. */
  get matches(): RouteMatch[] {
    return this.#matches;
  }

  get routes(): RouteDefinition[] {
    return this.#routes;
  }

  /** Called whenever the location changes, from browser history or from the host. */
  setUrl(url: string): void {
    this.#url = url;
  }

  setBasePath(basePath: string | null | undefined): void {
    this.#basePath = normalizeBase(basePath);
  }

  setRoutes(routes: RouteDefinition[]): void {
    this.#routes = routes;
  }

  /** Full href for a target relative to the base: `href('/users')` is `/admin/users`. */
  href(to: string): string {
    const target = resolveTarget(to, this.#path ?? '/');
    return joinBase(this.#basePath, target.pathname) + target.search + target.hash;
  }

  /**
   * Navigate within this app. `to` is relative to the base and may include a query or hash.
   * Navigating to the current URL replaces the entry, so Back doesn't appear to do nothing.
   */
  navigate(to: string, options: NavigateOptions = {}): void {
    const href = this.href(to);
    this.#navigate(href, { replace: options.replace ?? href === this.#url });
  }

  /** Navigate to a path owned by the host, outside this app's base path. */
  navigateHost(href: string, options: NavigateOptions = {}): void {
    this.#navigate(href, { replace: options.replace ?? false });
  }

  /** Set or remove query params (`null`/`undefined` removes). Keeps the current path. */
  setQuery(updates: QueryUpdates, options: NavigateOptions = {}): void {
    const query = new URLSearchParams(this.#parts.search);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === undefined) query.delete(key);
      else query.set(key, String(value));
    }
    const search = query.toString();
    this.navigate((this.#path ?? '/') + (search ? `?${search}` : ''), options);
  }
}

export function createRouter(options: RouterOptions): RouterCore {
  return new RouterCore(options);
}
