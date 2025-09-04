import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

/**
 * Safely lazy-loads a component with retry logic.
 */
function loadView(loader, { retries = 2, retryDelay = 400 } = {}) {
  return defineAsyncComponent({
    loader: async () => {
      let lastErr
      for (let i = 0; i <= retries; i++) {
        try {
          return await loader()
        } catch (err) {
          lastErr = err
          await new Promise(r => setTimeout(r, retryDelay))
        }
      }
      throw lastErr
    },
    delay: 120,
    timeout: 30000,
  })
}

// Lazy-loaded route components
const Home     = loadView(() => import('@/features/home/HomeView.vue'))
const Swim     = loadView(() => import('@/features/swim/SwimView.vue'))
const Refill   = loadView(() => import('@/features/refill/RefillView.vue'))
const KnowB4Go = loadView(() => import('@/features/knowb4go/KnowB4GoView.vue'))

// Route definitions
const routes = [
  { path: '/',           name: 'Home',     component: Home,     meta: { title: 'Home' } },
  { path: '/swim',       name: 'Swim',     component: Swim,     meta: { title: 'Swim' } },
  { path: '/refill',     name: 'Refill',   component: Refill,   meta: { title: 'Refill' } },
  { path: '/knowb4go',   name: 'KnowB4Go', component: KnowB4Go, meta: { title: 'Know Before You Go' } },
]

// Create router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
})

// Optional: Update page title
router.afterEach((to) => {
  document.title = to.meta.title || 'My App'
})

export default router
