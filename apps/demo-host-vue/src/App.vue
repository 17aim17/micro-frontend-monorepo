<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// Path and query, like the React host shows.
const location = computed(() => route.fullPath.split('#')[0])
</script>

<template>
  <div class="shell">
    <aside>
      <p class="brand">Dashboard <span class="framework-badge">Vue host</span></p>
      <nav>
        <RouterLink to="/" data-testid="host-nav-home" exact-active-class="active">Home</RouterLink>
        <RouterLink to="/reports" data-testid="host-nav-reports" active-class="active">Reports</RouterLink>
        <RouterLink to="/admin" data-testid="host-nav-admin" active-class="active">Admin</RouterLink>
      </nav>
    </aside>
    <div class="content">
      <p class="host-location">
        Host router location: <code data-testid="host-location">{{ location }}</code>
      </p>
      <RouterView />
    </div>
  </div>
</template>
