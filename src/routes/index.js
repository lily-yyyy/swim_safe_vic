// // src/routes/index.js
// import { createRouter, createWebHistory } from 'vue-router'

// // Lazy-loaded components for code splitting
// const Home = () => import('@/features/home/HomeView.vue')
// const Swim = () => import('@/features/swim/SwimView.vue')
// const Refill = () => import('@/features/refill/RefillView.vue')
// const KnowB4Go = () => import('@/features/knowb4go/KnowB4GoView.vue')

// const routes = [
//   { path: '/', name: 'Home', component: Home },
//   { path: '/swim', name: 'Swim', component: Swim },
//   { path: '/refill', name: 'Refill', component: Refill },
//   { path: '/knowb4go', name: 'KnowB4Go', component: KnowB4Go }
// ]

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// })

// export default router


// src/routes/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

/**
 * Small helper to load views safely with retries.
 * Prevents "component is null" errors if a chunk fails to load once.
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
          // optional: only retry on network/chunk errors
          await new Promise(r => setTimeout(r, retryDelay))
        }
      }
      throw lastErr
    },
    // Optional UX hooks (lightweight; can be omitted)
    delay: 120,     // show nothing for 120ms before resolving
    timeout: 30000, // give up after 30s
    onError(err, retry, fail, attempts) {
      if (attempts <= retries) {
        setTimeout(() => retry(), retryDelay)
      } else {
        fail()
      }
    },
  })
}

// Lazy-loaded views (code-splitting)
const Home     = loadView(() => import('@/features/home/HomeView.vue'))
const Swim     = loadView(() => import('@/features/swim/SwimView.vue'))
const Refill   = loadView(() => import('@/features/refill/RefillView.vue'))
const KnowB4Go = loadView(() => import('@/features/knowb4go/KnowB4GoView.vue'))

// Inline minimal 404 so you don't need another file
const NotFound = {
  name: 'NotFound',
  template: `<main class="view-wrapper" style="padding:2rem">
    <h1 style="margin:0 0 .5rem 0">Page not found</h1>
    <p>The page you’re looking for doesn’t exist.</p>
  </main>`,
}

export const routes = [
  { path: '/',           name: 'Home',     component: Home,     meta: { title: 'Home' } },
  { path: '/swim',       name: 'Swim',     component: Swim,     meta: { title: 'Swim' } },
  { path: '/refill',     name: 'Refill',   component: Refill,   meta: { title: 'Refill' } },
  { path: '/knowb4go',   name: 'KnowB4Go', component: KnowB4Go, meta: { title: 'Know Before You Go' } },

  // Catch-all 404 (must be last)
  { path: '/:pathMatch(.*)*', name: '404', component: NotFound, meta: { title: 'Not Found' } },
]

const router = createRouter({
  // Use your Vite base (works for GH Pages/subpaths too)
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { left: 0, top: 0 }
  },
})

// (Optional) update document title by route meta
router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = `${to.meta.title} • SwimSafe`
  }
})

export default router
