import { describe, expect, it, vi } from 'vitest';
import type { Component } from 'svelte';
import { createRouter } from '../src/core/router.svelte.js';

const component = (name: string) => name as unknown as Component;
const UsersLayout = component('UsersLayout');
const UserDetail = component('UserDetail');
const NotFound = component('NotFound');

const routes = [
  { path: '/users', component: UsersLayout, children: [{ path: '/:id', component: UserDetail }] },
  { path: '*', component: NotFound }
];

function setup(url = '/admin/users/42?role=editor') {
  const navigate = vi.fn();
  const router = createRouter({ url, basePath: '/admin/', routes, navigate });
  return { router, navigate };
}

describe('RouterCore', () => {
  it('derives the relative path, params and query from the URL', () => {
    const { router } = setup();
    expect(router.basePath).toBe('/admin');
    expect(router.path).toBe('/users/42');
    expect(router.params).toEqual({ id: '42' });
    expect(router.query.get('role')).toBe('editor');
    expect(router.matches.map((m) => m.route.component)).toEqual([UsersLayout, UserDetail]);
  });

  it('updates when the location changes', () => {
    const { router } = setup();
    router.setUrl('/admin/users/7');
    expect(router.params).toEqual({ id: '7' });
    expect(router.query.has('role')).toBe(false);
  });

  it('reports nothing when the URL is outside the base', () => {
    const { router } = setup('/reports');
    expect(router.path).toBeNull();
    expect(router.matches).toEqual([]);
  });

  it('navigates with the base path added, and does not change state by itself', () => {
    const { router, navigate } = setup();
    router.navigate('/users/7');
    expect(navigate).toHaveBeenCalledWith('/admin/users/7', { replace: false });
    expect(router.params).toEqual({ id: '42' });
  });

  it('replaces instead of pushing when navigating to the current URL', () => {
    const { router, navigate } = setup('/admin/users/42');
    router.navigate('/users/42');
    expect(navigate).toHaveBeenLastCalledWith('/admin/users/42', { replace: true });
    router.navigate('/users/42', { replace: false });
    expect(navigate).toHaveBeenLastCalledWith('/admin/users/42', { replace: false });
  });

  it('navigates to host paths as they are', () => {
    const { router, navigate } = setup();
    router.navigateHost('/reports', { replace: true });
    expect(navigate).toHaveBeenCalledWith('/reports', { replace: true });
  });

  it('builds hrefs relative to the base', () => {
    const { router } = setup();
    expect(router.href('/')).toBe('/admin');
    expect(router.href('/users?role=admin')).toBe('/admin/users?role=admin');
    expect(router.href('/../../outside')).toBe('/admin/outside');
  });

  it('sets and removes query params while keeping the path', () => {
    const { router, navigate } = setup('/admin/users?role=editor&page=2');
    router.setQuery({ role: 'admin', page: null });
    expect(navigate).toHaveBeenLastCalledWith('/admin/users?role=admin', { replace: false });
    // The new location comes back from the browser or host before the next change.
    router.setUrl('/admin/users?role=admin');
    router.setQuery({ role: undefined }, { replace: true });
    expect(navigate).toHaveBeenLastCalledWith('/admin/users', { replace: true });
  });

  it('re-derives everything when the base path changes', () => {
    const { router } = setup('/apps/admin/users/42');
    expect(router.path).toBeNull();
    router.setBasePath('/apps/admin');
    expect(router.params).toEqual({ id: '42' });
  });
});
