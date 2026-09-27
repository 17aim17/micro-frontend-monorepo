import { createRouter, createWebHistory } from 'vue-router'
import AdminRoute from './AdminRoute.vue'
import Home from './pages/Home.vue'
import NotFound from './pages/NotFound.vue'
import Reports from './pages/Reports.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/reports', component: Reports },
    // Everything under /admin belongs to the admin remote.
    { path: '/admin/:rest(.*)*', component: AdminRoute },
    { path: '/:unknown(.*)*', component: NotFound },
  ],
})
