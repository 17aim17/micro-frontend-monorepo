// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushSync } from 'svelte';
import { defineRemote, NAVIGATE_EVENT, type MfeNavigateDetail } from '../src/element/defineRemote.js';
import TestApp from './fixtures/TestApp.svelte';

defineRemote('test-app', TestApp);
defineRemote('test-app-light', TestApp, { shadow: false });

function render(attributes: Record<string, string>, tag = 'test-app'): HTMLElement {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  document.body.append(element);
  flushSync();
  return element;
}

const root = (element: HTMLElement) => element.shadowRoot ?? element;
const heading = (element: HTMLElement) => root(element).querySelector('h1')?.textContent;
const click = (element: HTMLElement, testId: string) => {
  root(element)
    .querySelector<HTMLElement>(`[data-testid="${testId}"]`)!
    .dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true, button: 0 }));
  flushSync();
};

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  // jsdom doesn't implement scrolling.
  window.scrollTo = () => {};
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('host-managed (url attribute set)', () => {
  it('renders the route for the url the host passes, inside a shadow root', () => {
    const element = render({ 'base-path': '/admin', url: '/admin/users/42' });
    expect(element.shadowRoot).not.toBeNull();
    expect(heading(element)).toBe('User 42');
  });

  it('asks the host to navigate and waits for the new url', () => {
    const element = render({ 'base-path': '/admin', url: '/admin' });
    const requests: MfeNavigateDetail[] = [];
    element.addEventListener(NAVIGATE_EVENT, (event) => {
      event.preventDefault();
      requests.push((event as CustomEvent<MfeNavigateDetail>).detail);
    });

    click(element, 'user-42');
    expect(requests).toEqual([{ href: '/admin/users/42', replace: false }]);
    expect(window.location.pathname).toBe('/');
    expect(heading(element)).toBe('Home');

    element.setAttribute('url', '/admin/users/42');
    flushSync();
    expect(heading(element)).toBe('User 42');
  });

  it('sends host paths as they are', () => {
    const element = render({ 'base-path': '/admin', url: '/admin' });
    const hrefs: string[] = [];
    element.addEventListener(NAVIGATE_EVENT, (event) => {
      event.preventDefault();
      hrefs.push((event as CustomEvent<MfeNavigateDetail>).detail.href);
    });
    click(element, 'reports');
    expect(hrefs).toEqual(['/reports']);
  });

  it('falls back to history and popstate when no host handles the event', () => {
    const element = render({ 'base-path': '/admin', url: '/admin' });
    const popstate = vi.fn();
    window.addEventListener('popstate', popstate);

    click(element, 'user-42');
    expect(window.location.pathname).toBe('/admin/users/42');
    expect(popstate).toHaveBeenCalledOnce();
    window.removeEventListener('popstate', popstate);
  });

  it('adds no window listeners', () => {
    const add = vi.spyOn(window, 'addEventListener');
    render({ 'base-path': '/admin', url: '/admin' });
    expect(add.mock.calls.filter(([type]) => type === 'popstate')).toHaveLength(0);
  });

  it('leaves external links to the browser', () => {
    const element = render({ 'base-path': '/admin', url: '/admin' });
    const link = element.shadowRoot!.querySelector<HTMLAnchorElement>('[data-testid="external"]')!;
    expect(link.getAttribute('href')).toBe('https://svelte.dev');

    const navigate = vi.fn();
    element.addEventListener(NAVIGATE_EVENT, navigate);
    // The document sees the click after the router's handler: record whether the router
    // cancelled it, then cancel it so jsdom doesn't try to leave the page.
    let cancelledByRouter: boolean | undefined;
    const onClick = (event: Event) => {
      cancelledByRouter = event.defaultPrevented;
      event.preventDefault();
    };
    document.addEventListener('click', onClick);
    click(element, 'external');
    document.removeEventListener('click', onClick);

    expect(cancelledByRouter).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('shows its own not-found view for unknown paths under the base', () => {
    const element = render({ 'base-path': '/admin', url: '/admin/nope' });
    expect(heading(element)).toBe('Not found');
  });
});

describe('self-managed (no url attribute)', () => {
  it('reads the browser location and owns history', () => {
    window.history.replaceState(null, '', '/admin/users/7');
    const element = render({ 'base-path': '/admin' });
    expect(heading(element)).toBe('User 7');

    click(element, 'home');
    expect(window.location.pathname).toBe('/admin');
    expect(heading(element)).toBe('Home');
  });

  it('follows back and forward', () => {
    const element = render({ 'base-path': '/admin' });
    window.history.pushState(null, '', '/admin/users/42');
    window.dispatchEvent(new PopStateEvent('popstate'));
    flushSync();
    expect(heading(element)).toBe('User 42');
  });

  it('removes its popstate listener when removed', () => {
    const element = render({ 'base-path': '/admin' });
    const remove = vi.spyOn(window, 'removeEventListener');
    element.remove();
    expect(remove.mock.calls.filter(([type]) => type === 'popstate')).toHaveLength(1);
  });
});

describe('lifecycle and styles', () => {
  it('unmounts on removal and mounts again when re-added', () => {
    const element = render({ 'base-path': '/admin', url: '/admin/users/42' });
    element.remove();
    flushSync();
    expect(heading(element)).toBeUndefined();

    document.body.append(element);
    flushSync();
    expect(heading(element)).toBe('User 42');
  });

  it('puts component styles in the shadow root, not the document', () => {
    const element = render({ 'base-path': '/admin', url: '/admin' });
    expect(element.shadowRoot!.querySelector('style')?.textContent).toContain('rgb(255, 0, 0)');
    expect(document.head.querySelector('style')).toBeNull();
  });

  it('renders into light DOM when shadow is off', () => {
    const element = render({ 'base-path': '/admin', url: '/admin/users/42' }, 'test-app-light');
    expect(element.shadowRoot).toBeNull();
    expect(element.querySelector('h1')?.textContent).toBe('User 42');
  });
});
