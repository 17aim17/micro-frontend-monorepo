// Higher is more specific. EXACT_END marks a pattern that ended exactly where the path ended,
// which beats a wildcard that could have matched anything.
const RANK = { static: 3, param: 2, wildcard: 1 };
const EXACT_END = 4;
const patternCache = new WeakMap();
export function splitPath(path) {
    return path.split('/').filter(Boolean);
}
function decode(part) {
    try {
        return decodeURIComponent(part);
    }
    catch {
        return part;
    }
}
/** Parses a route pattern into segments. Throws on patterns that can never match sensibly. */
export function parsePattern(pattern) {
    const parts = splitPath(pattern);
    return parts.map((part, index) => {
        if (part === '*') {
            if (index !== parts.length - 1) {
                throw new Error(`Route "${pattern}": "*" must be the last segment.`);
            }
            return { kind: 'wildcard' };
        }
        if (part.startsWith(':')) {
            const name = part.slice(1);
            if (!name)
                throw new Error(`Route "${pattern}": a parameter needs a name, like ":id".`);
            return { kind: 'param', name };
        }
        return { kind: 'static', value: part };
    });
}
function segmentsOf(route) {
    let segments = patternCache.get(route);
    if (!segments) {
        segments = parsePattern(route.path);
        patternCache.set(route, segments);
    }
    return segments;
}
/** Matches `pattern` against the start of `parts`. */
function matchPrefix(pattern, parts) {
    const params = {};
    const ranks = [];
    for (let i = 0; i < pattern.length; i++) {
        const segment = pattern[i];
        if (segment.kind === 'wildcard') {
            params['*'] = parts.slice(i).map(decode).join('/');
            ranks.push(RANK.wildcard);
            return { params, rest: [], ranks, wildcard: true };
        }
        const part = parts[i];
        if (part === undefined)
            return null;
        if (segment.kind === 'static') {
            if (decode(part) !== segment.value)
                return null;
        }
        else {
            params[segment.name] = decode(part);
        }
        ranks.push(RANK[segment.kind]);
    }
    return { params, rest: parts.slice(pattern.length), ranks, wildcard: false };
}
function compareRanks(a, b) {
    const length = Math.max(a.length, b.length);
    for (let i = 0; i < length; i++) {
        const difference = (a[i] ?? 0) - (b[i] ?? 0);
        if (difference !== 0)
            return difference;
    }
    return 0;
}
function findBest(routes, parts, inherited) {
    let best = null;
    for (const route of routes) {
        const prefix = matchPrefix(segmentsOf(route), parts);
        if (!prefix)
            continue;
        const params = { ...inherited, ...prefix.params };
        const self = { route, params };
        let candidate = null;
        const child = route.children?.length ? findBest(route.children, prefix.rest, params) : null;
        if (child) {
            candidate = { chain: [self, ...child.chain], ranks: [...prefix.ranks, ...child.ranks] };
        }
        else if (prefix.rest.length === 0) {
            candidate = {
                chain: [self],
                ranks: prefix.wildcard ? prefix.ranks : [...prefix.ranks, EXACT_END]
            };
        }
        // Ties keep the earlier route, so declaration order breaks them.
        if (candidate && (!best || compareRanks(candidate.ranks, best.ranks) > 0)) {
            best = candidate;
        }
    }
    return best;
}
/**
 * Finds the most specific chain of routes for `path` (relative to the base).
 * Returns `[]` when nothing matches. Static segments beat params, params beat `*`,
 * and a route that ends exactly at the end of the path beats a wildcard.
 */
export function matchRoutes(routes, path) {
    return findBest(routes, splitPath(path), {})?.chain ?? [];
}
