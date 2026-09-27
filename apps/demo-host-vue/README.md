# demo-host-vue

Vue 3 dashboard that hosts the same Svelte admin remote under `/admin`, using Vue Router and `@module-federation/runtime`. Scaffolded with `create vite` (vue-ts). It exists to show the remote works unchanged in a second framework.

The integration is [`src/AdminRoute.vue`](src/AdminRoute.vue) and [`src/loadAdminRemote.ts`](src/loadAdminRemote.ts). See the [root README](../../README.md) to run it.
