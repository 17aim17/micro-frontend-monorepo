import type { HTMLAnchorAttributes } from 'svelte/elements';
interface Props extends Omit<HTMLAnchorAttributes, 'href'> {
    /** Target relative to the app's base path, e.g. `/users/42` or `?role=editor`. */
    to: string;
    replace?: boolean;
}
declare const Link: import("svelte").Component<Props, {}, "">;
type Link = ReturnType<typeof Link>;
export default Link;
