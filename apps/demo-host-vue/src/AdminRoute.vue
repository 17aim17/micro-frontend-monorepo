<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loadAdminRemote } from './loadAdminRemote'

interface MfeNavigateDetail {
  href: string
  replace: boolean
}

// The whole host-side integration. The host hands the remote everything under /admin:
// it passes the current URL down, and routes the remote's navigation requests through
// Vue Router, so both routers always agree on the URL.
//
// If the remote can't be loaded, the host still owns /admin: the URL stays, host navigation
// keeps working, and the user can retry (or come back later, which retries too).
const route = useRoute()
const router = useRouter()
const status = ref<'loading' | 'ready' | 'failed'>(customElements.get('admin-app') ? 'ready' : 'loading')

function load() {
  loadAdminRemote().then(
    () => (status.value = 'ready'),
    (error: unknown) => {
      console.error('Could not load the admin remote', error)
      status.value = 'failed'
    },
  )
}

function retry() {
  status.value = 'loading'
  load()
}

onMounted(load)

function onNavigate(event: Event) {
  event.preventDefault()
  const { href, replace } = (event as CustomEvent<MfeNavigateDetail>).detail
  if (href.startsWith('/') && !href.startsWith('//')) {
    if (replace) router.replace(href)
    else router.push(href)
  } else {
    window.location.assign(href) // Not a path in this app: leave with a full page load.
  }
}
</script>

<template>
  <div v-if="status === 'failed'" role="alert" class="remote-error">
    <p>The admin app couldn't be loaded.</p>
    <button type="button" @click="retry">Try again</button>
  </div>
  <template v-else>
    <p v-if="status === 'loading'" class="remote-loading">Loading admin…</p>
    <admin-app base-path="/admin" :url="route.fullPath" @mfe-navigate="onNavigate" />
  </template>
</template>
