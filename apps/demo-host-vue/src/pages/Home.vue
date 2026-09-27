<template>
  <h1>Welcome back</h1>
  <p>This dashboard is a Vue app. The Admin section is a separate Svelte app mounted under /admin.</p>
  <ul>
    <li><RouterLink to="/admin/users/42" data-testid="host-link-user-42">Open Grace Hopper in Admin</RouterLink></li>
    <li><RouterLink to="/admin/users?role=editor" data-testid="host-link-editors">See all editors</RouterLink></li>
  </ul>
</template>
