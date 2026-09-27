// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import PlainApp from './fixtures/PlainApp.svelte';

// A plain Svelte app: <Router> with no custom element, owning browser history.
let target: HTMLElement;
let app: Record<string, unknown> | undefined;
let props: { basePath?: string };

function start(url: string, basePath?: string) {
  window.history.replaceState(null, '', url);
  const state = $state({ basePath });
  props = state;
  app = mount(PlainApp, { target, props: state });
  flushSync();
}

const heading = () => target.querySelector('h1')?.textContent;
const click = (testId: string) => {
  target
    .querySelector<HTMLElement>(`[data-testid="${testId}"]`)!
    .dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true, button: 0 }));
  flushSync();
};

beforeEach(() => {
  window.scrollTo = () => {};
  target = document.createElement('div');
  document.body.append(target);
});

afterEach(() => {
  if (app) void unmount(app);
  app = undefined;
  document.body.innerHTML = '';
});

describe('<Router> in a plain app', () => {
  it('renders the route for the browser location', () => {
    start('/users/42');
    expect(heading()).toBe('User 42');
  });

  it('writes browser history when navigating', () => {
    start('/users/42');
    click('home');
    expect(window.location.pathname).toBe('/');
    expect(heading()).toBe('Home');
  });

  it('follows back and forward', () => {
    start('/');
    window.history.pushState(null, '', '/users/7');
    window.dispatchEvent(new PopStateEvent('popstate'));
    flushSync();
    expect(heading()).toBe('User 7');
  });

  it('routes under a base path and follows changes to it', () => {
    start('/app/users/42', '/app');
    expect(heading()).toBe('User 42');
    expect(target.querySelector('[data-testid="home"]')?.getAttribute('href')).toBe('/app');

    window.history.replaceState(null, '', '/v2/users/42');
    props.basePath = '/v2';
    window.dispatchEvent(new PopStateEvent('popstate'));
    flushSync();
    expect(heading()).toBe('User 42');
    expect(target.querySelector('[data-testid="home"]')?.getAttribute('href')).toBe('/v2');
  });
});
