import { mount, unmount, type Component } from 'svelte';
import { browserUrl, listenToBrowser, writeHistory } from '../core/browser.js';
import { createRouter, type RouterCore } from '../core/router.svelte.js';
import { ROUTER_KEY } from '../context.js';

/** Event the element dispatches when the app wants to navigate. Hosts listen for it. */
export const NAVIGATE_EVENT = 'mfe-navigate';

export interface MfeNavigateDetail {
  /** Full href, base path included, or a host path for `navigateHost()`. */
  href: string;
  replace: boolean;
}

export interface DefineRemoteOptions {
  /**
   * Render the app inside a shadow root, so host CSS can't reach it and its CSS can't leak out.
   * Default `true`. Compile the app's Svelte styles as injected (`css: 'injected'`) so they land
   * in the shadow root.
   */
  shadow?: boolean;
}

/**
 * Registers `App` as a custom element that a host renders under the base path it gives the app:
 *
 * ```html
 * <admin-app base-path="/admin" url="/admin/users/42"></admin-app>
 * ```
 *
 * - With a `url` attribute (host-managed), the host owns history: the element asks it to
 *   navigate with a cancelable `mfe-navigate` event and re-renders when `url` changes. If no
 *   host handles the event, it writes history itself and fires `popstate` so the host's router
 *   can pick the change up.
 * - Without `url` (self-managed), the element owns browser history, for running on its own.
 *
 * Adding the element mounts the app; removing it unmounts the app and removes its listeners.
 */
export function defineRemote(
  tag: string,
  App: Component<any>,
  options: DefineRemoteOptions = {}
): CustomElementConstructor {
  const existing = customElements.get(tag);
  if (existing) return existing;

  const shadow = options.shadow ?? true;

  class RemoteElement extends HTMLElement {
    static observedAttributes = ['base-path', 'url'];

    #app: Record<string, unknown> | null = null;
    #router: RouterCore | null = null;
    #cleanup: Array<() => void> = [];

    connectedCallback(): void {
      if (this.#app) return;

      const hostManaged = this.hasAttribute('url');
      const router = createRouter({
        basePath: this.getAttribute('base-path') ?? '/',
        url: hostManaged ? (this.getAttribute('url') ?? '/') : browserUrl(),
        navigate: (href, { replace }) => (hostManaged ? this.#askHost(href, replace) : this.#writeOwn(href, replace))
      });
      this.#router = router;
      if (!hostManaged) this.#cleanup.push(listenToBrowser(router));

      const target = shadow ? (this.shadowRoot ?? this.attachShadow({ mode: 'open' })) : this;
      this.#app = mount(App, { target, context: new Map([[ROUTER_KEY, router]]) });
    }

    disconnectedCallback(): void {
      if (this.#app) void unmount(this.#app);
      this.#app = null;
      this.#router = null;
      for (const cleanup of this.#cleanup.splice(0)) cleanup();
    }

    attributeChangedCallback(name: string, _previous: string | null, value: string | null): void {
      if (!this.#router) return;
      if (name === 'url' && value !== null) this.#router.setUrl(value);
      if (name === 'base-path') this.#router.setBasePath(value);
    }

    #askHost(href: string, replace: boolean): void {
      const event = new CustomEvent<MfeNavigateDetail>(NAVIGATE_EVENT, {
        detail: { href, replace },
        bubbles: true,
        composed: true,
        cancelable: true
      });
      const handledByHost = !this.dispatchEvent(event);
      if (handledByHost) return;

      // No host glue: change the URL ourselves and tell whoever listens to history about it.
      // The host is expected to update the `url` attribute from there.
      writeHistory(href, replace);
      window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }));
    }

    #writeOwn(href: string, replace: boolean): void {
      writeHistory(href, replace);
      this.#router?.setUrl(browserUrl());
    }
  }

  customElements.define(tag, RemoteElement);
  return RemoteElement;
}
