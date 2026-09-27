import type { RouteDefinition } from '../core/matcher.js';
interface Props {
    routes: RouteDefinition[];
    /** Where the app lives when it owns the URL, e.g. `/app`. Defaults to `/`. */
    basePath?: string;
}
declare const Router: import("svelte").Component<Props, {}, "">;
type Router = ReturnType<typeof Router>;
export default Router;
