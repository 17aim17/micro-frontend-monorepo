/** The parts of a URL the router cares about. */
export interface UrlParts {
    pathname: string;
    search: string;
    hash: string;
}
/**
 * Normalizes a base path: leading slash, no trailing slash, `/` for the root.
 * `admin`, `/admin/` and `/admin` all become `/admin`.
 */
export declare function normalizeBase(base: string | null | undefined): string;
/**
 * Returns the path relative to `base`, or `null` when `pathname` is outside it.
 * `stripBase('/admin', '/admin/users')` is `/users`, `stripBase('/admin', '/reports')` is `null`.
 */
export declare function stripBase(base: string, pathname: string): string | null;
/** Prefixes a relative path with `base`. `joinBase('/admin', '/users')` is `/admin/users`. */
export declare function joinBase(base: string, path: string): string;
/** Splits a URL or path (`/admin/users?role=editor#top`) into its parts. */
export declare function parseUrl(url: string): UrlParts;
/**
 * Resolves a navigation target against the current relative path, the way a browser resolves
 * a link. `/users` is relative to the base root, `?role=editor` keeps the current path, and
 * `..` can never climb above the base root, so a target can't escape the base.
 */
export declare function resolveTarget(to: string, currentPath: string): UrlParts;
/** Joins URL parts back into a string. */
export declare function formatUrl(parts: UrlParts): string;
