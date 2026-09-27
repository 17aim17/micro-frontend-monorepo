import type { RouteDefinition } from '../../src/core/matcher.js';
import Layout from './Layout.svelte';
import Home from './Home.svelte';
import User from './User.svelte';
import NotFound from './NotFound.svelte';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/users/:id', component: User },
      { path: '*', component: NotFound }
    ]
  }
];
