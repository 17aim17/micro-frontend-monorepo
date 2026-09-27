<!--
  A real <a> with the full href (base path included), so middle-click, "copy link" and
  "open in new tab" work. Plain left clicks navigate through the router instead of reloading.
-->
<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import { getRouter } from '../context.js';
  import { parseUrl } from '../core/paths.js';

  interface Props extends Omit<HTMLAnchorAttributes, 'href'> {
    /** Target relative to the app's base path, e.g. `/users/42` or `?role=editor`. */
    to: string;
    replace?: boolean;
  }

  let { to, replace = false, children, onclick, ...rest }: Props = $props();

  const router = getRouter();
  // Absolute URLs (https:, mailto:, //host) are rendered as they are and left to the browser.
  const external = $derived(/^[a-z][a-z\d+.-]*:/i.test(to) || to.startsWith('//'));
  const href = $derived(external ? to : router.href(to));

  const trim = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path);
  const active = $derived(!external && trim(parseUrl(href).pathname) === trim(parseUrl(router.url).pathname));

  function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement }) {
    onclick?.(event);
    if (event.defaultPrevented || external) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = event.currentTarget.getAttribute('target');
    if ((target && target !== '_self') || event.currentTarget.hasAttribute('download')) return;
    event.preventDefault();
    router.navigate(to, { replace });
  }
</script>

<a {href} aria-current={active ? 'page' : undefined} {...rest} onclick={handleClick}>{@render children?.()}</a>
