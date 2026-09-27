import { describe, expect, it } from 'vitest';
import type { Component } from 'svelte';
import { matchRoutes, parsePattern, type RouteDefinition } from '../src/core/matcher.js';

// The matcher never renders components, so any unique value works as a stand-in.
const component = (name: string) => name as unknown as Component;

const Overview = component('Overview');
const UsersLayout = component('UsersLayout');
const UserList = component('UserList');
const UserDetail = component('UserDetail');
const UserNew = component('UserNew');
const NotFound = component('NotFound');

const routes: RouteDefinition[] = [
  { path: '/', component: Overview },
  {
    path: '/users',
    component: UsersLayout,
    children: [
      { path: '/', component: UserList },
      { path: '/:id', component: UserDetail },
      { path: '/new', component: UserNew }
    ]
  },
  { path: '*', component: NotFound }
];

const components = (path: string) => matchRoutes(routes, path).map((match) => match.route.component);

describe('matchRoutes', () => {
  it('matches the root', () => {
    expect(components('/')).toEqual([Overview]);
  });

  it('matches a nested index route', () => {
    expect(components('/users')).toEqual([UsersLayout, UserList]);
    expect(components('/users/')).toEqual([UsersLayout, UserList]);
  });

  it('matches nested params and passes them down the chain', () => {
    const matches = matchRoutes(routes, '/users/42');
    expect(matches.map((m) => m.route.component)).toEqual([UsersLayout, UserDetail]);
    expect(matches[1].params).toEqual({ id: '42' });
  });

  it('prefers static segments over params regardless of order', () => {
    expect(components('/users/new')).toEqual([UsersLayout, UserNew]);
  });

  it('falls back to the wildcard for unknown paths', () => {
    const matches = matchRoutes(routes, '/nope/deeper');
    expect(matches.map((m) => m.route.component)).toEqual([NotFound]);
    expect(matches[0].params).toEqual({ '*': 'nope/deeper' });
  });

  it('falls back to the wildcard when a nested path does not match', () => {
    expect(components('/users/42/extra')).toEqual([NotFound]);
  });

  it('decodes params', () => {
    expect(matchRoutes(routes, '/users/jane%20doe')[1].params).toEqual({ id: 'jane doe' });
  });

  it('returns an empty chain when nothing matches and there is no wildcard', () => {
    expect(matchRoutes([{ path: '/', component: Overview }], '/users')).toEqual([]);
  });

  it('breaks ties by declaration order', () => {
    const first = component('first');
    const second = component('second');
    const table = [
      { path: '/:a', component: first },
      { path: '/:b', component: second }
    ];
    expect(matchRoutes(table, '/x')[0].route.component).toBe(first);
  });

  it('matches a parent without an index route when the path ends at the parent', () => {
    const table = [{ path: '/users', component: UsersLayout, children: [{ path: '/:id', component: UserDetail }] }];
    expect(matchRoutes(table, '/users').map((m) => m.route.component)).toEqual([UsersLayout]);
  });
});

describe('parsePattern', () => {
  it('rejects a wildcard that is not last', () => {
    expect(() => parsePattern('/*/users')).toThrow('"*" must be the last segment');
  });

  it('rejects a nameless param', () => {
    expect(() => parsePattern('/users/:')).toThrow('needs a name');
  });
});
