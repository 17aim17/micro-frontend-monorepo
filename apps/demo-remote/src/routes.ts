import type { RouteDefinition } from 'svelte-microfrontend-router';
import Layout from './pages/Layout.svelte';
import Overview from './pages/Overview.svelte';
import UsersLayout from './pages/UsersLayout.svelte';
import UserList from './pages/UserList.svelte';
import UserDetail from './pages/UserDetail.svelte';
import NotFound from './pages/NotFound.svelte';

// All paths are relative to wherever the host mounts the app (e.g. /admin).
export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Overview },
      {
        path: '/users',
        component: UsersLayout,
        children: [
          { path: '/', component: UserList },
          { path: '/:id', component: UserDetail }
        ]
      },
      { path: '*', component: NotFound }
    ]
  }
];
