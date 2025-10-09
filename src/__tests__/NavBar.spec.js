import { render, screen, fireEvent } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import NavBar from '@/components/ui/NavBar.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: { template: '<div>Home</div>' } },
  { path: '/swim', name: 'Swim', component: { template: '<div>Swim</div>' } },
  { path: '/learn', name: 'Learn', component: { template: '<div>Learn</div>' } }
]

// Reusable render function with router setup
const renderWithRouter = async (initialPath = '/') => {
  const router = createRouter({
    history: createWebHistory(),
    routes
  })

  // Push to a specific route like '/' to control logic in the component
  await router.push(initialPath)
  await router.isReady()

  return render(NavBar, {
    global: {
      plugins: [router]
    }
  })
}

describe('NavBar.vue', () => {
  it('emits open-planner when Planner button is clicked', async () => {
    // Render the component with router on the home route
    const { getByRole, emitted } = await renderWithRouter('/')

    // Find the Planner button by its accessible role and label
    const plannerBtn = getByRole('button', { name: 'Planner' })

    // Trigger click event
    await fireEvent.click(plannerBtn)

    // Check that the event was emitted
    expect(emitted()['open-planner']).toBeTruthy()
  })
})
