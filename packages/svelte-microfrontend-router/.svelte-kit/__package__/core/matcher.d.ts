import type { Component } from 'svelte';
/** One entry in a route table. */
export interface RouteDefinition {
    /** Pattern relative to the parent: `/`, `/users`, `/users/:id`, or `*` to match anything. */
    path: string;
    component: Component<any>;
    /** Nested routes, rendered by an `<Outlet />` inside `component`. */
    children?: RouteDefinition[];
}
export type Params = Record<string, string>;
/** A matched route and the params collected up to and including it. */
export interface RouteMatch {
    route: RouteDefinition;
    params: Params;
}
type Segment = {
    kind: 'static';
    value: string;
} | {
    kind: 'param';
    name: string;
} | {
    kind: 'wildcard';
};
export declare function splitPath(path: string): string[];
/** Parses a route pattern into segments. Throws on patterns that can never match sensibly. */
export declare function parsePattern(pattern: string): Segment[];
/**
 * Finds the most specific chain of routes for `path` (relative to the base).
 * Returns `[]` when nothing matches. Static segments beat params, params beat `*`,
 * and a route that ends exactly at the end of the path beats a wildcard.
 */
export declare function matchRoutes(routes: RouteDefinition[], path: string): RouteMatch[];
export {};
