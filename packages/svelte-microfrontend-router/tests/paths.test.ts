import { describe, expect, it } from 'vitest';
import { joinBase, normalizeBase, parseUrl, resolveTarget, stripBase } from '../src/lib/core/paths.js';

describe('normalizeBase', () => {
  it.each([
    [undefined, '/'],
    ['', '/'],
    ['/', '/'],
    ['admin', '/admin'],
    ['/admin/', '/admin'],
    ['/admin//', '/admin'],
    ['/apps/admin', '/apps/admin']
  ])('%s -> %s', (input, expected) => {
    expect(normalizeBase(input)).toBe(expected);
  });
});

describe('stripBase', () => {
  it('returns the path relative to the base', () => {
    expect(stripBase('/admin', '/admin/users/42')).toBe('/users/42');
  });

  it('treats the base itself, with or without a trailing slash, as the root', () => {
    expect(stripBase('/admin', '/admin')).toBe('/');
    expect(stripBase('/admin', '/admin/')).toBe('/');
  });

  it('returns null for paths outside the base', () => {
    expect(stripBase('/admin', '/reports')).toBeNull();
    expect(stripBase('/admin', '/administrator')).toBeNull();
  });

  it('passes paths through when the base is the root', () => {
    expect(stripBase('/', '/users')).toBe('/users');
  });
});

describe('joinBase', () => {
  it('prefixes the base', () => {
    expect(joinBase('/admin', '/users/42')).toBe('/admin/users/42');
    expect(joinBase('/admin', 'users')).toBe('/admin/users');
  });

  it('maps the relative root to the base itself', () => {
    expect(joinBase('/admin', '/')).toBe('/admin');
    expect(joinBase('/', '/')).toBe('/');
  });
});

describe('resolveTarget', () => {
  it('resolves absolute targets against the base root', () => {
    expect(resolveTarget('/users?role=editor', '/settings')).toEqual({
      pathname: '/users',
      search: '?role=editor',
      hash: ''
    });
  });

  it('keeps the current path for query-only targets', () => {
    expect(resolveTarget('?role=admin', '/users').pathname).toBe('/users');
  });

  it('never climbs above the base root', () => {
    expect(resolveTarget('/../../reports', '/users').pathname).toBe('/reports');
    expect(resolveTarget('../../../x', '/users/42').pathname).toBe('/x');
  });
});

describe('parseUrl', () => {
  it('splits a path into parts', () => {
    expect(parseUrl('/admin/users?role=editor#top')).toEqual({
      pathname: '/admin/users',
      search: '?role=editor',
      hash: '#top'
    });
  });
});
