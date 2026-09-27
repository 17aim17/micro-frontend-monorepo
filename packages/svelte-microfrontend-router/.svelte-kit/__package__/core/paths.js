const DUMMY_ORIGIN = 'http://router.invalid';
/**
 * Normalizes a base path: leading slash, no trailing slash, `/` for the root.
 * `admin`, `/admin/` and `/admin` all become `/admin`.
 */
export function normalizeBase(base) {
    if (!base)
        return '/';
    let value = base.trim();
    if (!value.startsWith('/'))
        value = '/' + value;
    value = value.replace(/\/+$/, '');
    return value || '/';
}
/**
 * Returns the path relative to `base`, or `null` when `pathname` is outside it.
 * `stripBase('/admin', '/admin/users')` is `/users`, `stripBase('/admin', '/reports')` is `null`.
 */
export function stripBase(base, pathname) {
    if (base === '/')
        return pathname || '/';
    if (pathname === base)
        return '/';
    if (pathname.startsWith(base + '/'))
        return pathname.slice(base.length) || '/';
    return null;
}
/** Prefixes a relative path with `base`. `joinBase('/admin', '/users')` is `/admin/users`. */
export function joinBase(base, path) {
    const relative = path.startsWith('/') ? path : '/' + path;
    if (base === '/')
        return relative;
    return relative === '/' ? base : base + relative;
}
/** Splits a URL or path (`/admin/users?role=editor#top`) into its parts. */
export function parseUrl(url) {
    const parsed = new URL(url, DUMMY_ORIGIN);
    return { pathname: parsed.pathname, search: parsed.search, hash: parsed.hash };
}
/**
 * Resolves a navigation target against the current relative path, the way a browser resolves
 * a link. `/users` is relative to the base root, `?role=editor` keeps the current path, and
 * `..` can never climb above the base root, so a target can't escape the base.
 */
export function resolveTarget(to, currentPath) {
    const resolved = new URL(to, DUMMY_ORIGIN + currentPath);
    return { pathname: resolved.pathname, search: resolved.search, hash: resolved.hash };
}
/** Joins URL parts back into a string. */
export function formatUrl(parts) {
    return parts.pathname + parts.search + parts.hash;
}
