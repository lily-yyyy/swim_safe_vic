// src/routes/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Lazy-loaded components for code splitting
const Home = () => import('@/components/HeroBanner.vue')
const Swim = () => import('@/features/swim/SwimView.vue')
const Refill = () => import('@/features/refill/RefillView.vue')
const KnowB4Go = () => import('@/features/knowb4go/KnowB4GoView.vue')

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/swim', name: 'Swim', component: Swim },
  { path: '/refill', name: 'Refill', component: Refill },
  { path: '/knowb4go', name: 'KnowB4Go', component: KnowB4Go }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
