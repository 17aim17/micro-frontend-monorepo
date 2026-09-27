// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { flushSync } from 'svelte';
import { defineRemote, NAVIGATE_EVENT, type MfeNavigateDetail } from '../src/element/defineRemote.js';
import TestApp from './fixtures/TestApp.svelte';

defineRemote('link-test-app', TestApp);

let element: HTMLElement;
let requests: MfeNavigateDetail[];

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  element = document.createElement('link-test-app');
  element.setAttribute('base-path', '/admin');
  element.setAttribute('url', '/admin');
  document.body.append(element);
  flushSync();
  requests = [];
  element.addEventListener(NAVIGATE_EVENT, (event) => {
    event.preventDefault();
    requests.push((event as CustomEvent<MfeNavigateDetail>).detail);
  });
});

afterEach(() => {
  document.body.innerHTML = '';
});

const link = (testId: string) => element.shadowRoot!.querySelector<HTMLAnchorElement>(`[data-testid="${testId}"]`)!;

/** Clicks like a user would, and reports whether the router took over the click. */
function click(testId: string, init: MouseEventInit = {}): boolean {
  let intercepted = false;
  // The document sees the click after the router; cancel it so jsdom doesn't navigate.
  const onClick = (event: Event) => {
    intercepted = event.defaultPrevented;
    event.preventDefault();
  };
  document.addEventListener('click', onClick);
  link(testId).dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true, button: 0, ...init }));
  document.removeEventListener('click', onClick);
  flushSync();
  return intercepted;
}

describe('Link', () => {
  it('renders the full href, base path included', () => {
    expect(link('user-42').getAttribute('href')).toBe('/admin/users/42');
    expect(link('home').getAttribute('href')).toBe('/admin');
  });

  it('pushes when going somewhere else', () => {
    expect(click('user-42')).toBe(true);
    expect(requests).toEqual([{ href: '/admin/users/42', replace: false }]);
  });

  it('replaces when clicking the page you are already on', () => {
    click('home');
    expect(requests).toEqual([{ href: '/admin', replace: true }]);
  });

  it.each([['ctrlKey'], ['metaKey'], ['shiftKey'], ['altKey']])('leaves %s clicks to the browser', (key) => {
    expect(click('user-42', { [key]: true })).toBe(false);
    expect(requests).toEqual([]);
  });

  it('leaves middle clicks to the browser', () => {
    expect(click('user-42', { button: 1 })).toBe(false);
    expect(requests).toEqual([]);
  });

  it('leaves target="_blank" links to the browser', () => {
    expect(click('user-42-new-tab')).toBe(false);
    expect(requests).toEqual([]);
  });

  it('gives javascript: links no href', () => {
    expect(link('javascript').hasAttribute('href')).toBe(false);
    expect(click('javascript')).toBe(false);
    expect(requests).toEqual([]);
  });

  it('marks the link for the current page', () => {
    expect(link('home').getAttribute('aria-current')).toBe('page');
    expect(link('user-42').hasAttribute('aria-current')).toBe(false);

    element.setAttribute('url', '/admin/users/42');
    flushSync();
    expect(link('user-42').getAttribute('aria-current')).toBe('page');
    expect(link('home').hasAttribute('aria-current')).toBe(false);
  });
});
