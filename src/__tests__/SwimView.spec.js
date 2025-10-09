import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import SwimView from '@/features/swim/SwimView.vue'
import { vi } from 'vitest'

// Mock child components (keep them simple)
vi.mock('@/features/swim/components/SwimMap.vue', () => ({
  default: {
    name: 'SwimMap',
    props: ['filters', 'searchQuery', 'zoomTarget'],
    emits: ['marker-clicked'],
    template: `<div data-testid="swim-map" @click="$emit('marker-clicked', mockLocation)"></div>`,
    setup() {
      return {
        mockLocation: {
          id: 1,
          name: 'Test Beach',
          type: 'beach',
          lat: -37.8679,
          lon: 144.974,
          getDirections: () => {}
        }
      }
    }
  }
}))

vi.mock('@/features/swim/components/FilterSidebar.vue', () => ({
  default: {
    name: 'FilterSidebar',
    props: ['results'],
    emits: ['update:filters', 'update:search', 'search-selected'],
    template: `
      <div data-testid="filter-sidebar">
        <button data-testid="search-suggestion" @click="$emit('search-selected', mockSearchLocation)">Select</button>
      </div>
    `,
    setup() {
      return {
        mockSearchLocation: {
          id: 2,
          name: 'Suggested Beach',
          type: 'beach',
          lat: -37.87,
          lon: 144.97
        }
      }
    }
  }
}))

vi.mock('@/components/ui/InfoDialog.vue', () => ({
  default: {
    name: 'InfoDialog',
    props: ['location'],
    emits: ['close', 'open-planner'],
    template: `<div data-testid="info-dialog">
      <button data-testid="close-info" @click="$emit('close')">Close</button>
      <button data-testid="open-planner" @click="$emit('open-planner')">Open Planner</button>
    </div>`
  }
}))

vi.mock('@/components/ui/ToiletInfo.vue', () => ({
  default: {
    name: 'ToiletInfo',
    props: ['toilet'],
    emits: ['close', 'submit'],
    template: `<div data-testid="toilet-info"></div>`
  }
}))

vi.mock('@/features/home/components/Planer.vue', () => ({
  default: {
    name: 'Planner',
    props: ['initialPlaceType', 'initialPlaceId'],
    emits: ['close'],
    template: `<div data-testid="planner"></div>`
  }
}))

// Mock APIs
vi.mock('@/api/webapi/beach_api', () => ({
  getAllBeaches: vi.fn(() => Promise.resolve([
    {
      id: 1,
      name: 'Test Beach',
      lat: -37.8679,
      lon: 144.9740,
      description_tips: 'Nice beach',
      status: 'Good'
    }
  ]))
}))

vi.mock('@/api/webapi/river_api', () => ({
  getAllRivers: vi.fn(() => Promise.resolve([
    {
      id: 2,
      name: 'Test River',
      lat: -37.8,
      lon: 144.9,
      description: 'City river',
      status: 'Excellent'
    }
  ]))
}))

vi.mock('@/api/webapi/toilet_api', () => ({
  getToiletById: vi.fn(() => Promise.resolve({
    id: 3,
    toilet_name: 'Test Toilet',
    opening_hours: '9am - 5pm',
    lat: -37.85,
    lon: 144.96
  })),
  getToiletAverageRating: vi.fn(() => Promise.resolve({ average_rating: 4.2 })),
  getLatestToiletComments: vi.fn(() => Promise.resolve([
    { toilet_id: 3, comment: 'Clean toilet!' }
  ])),
  submitToiletRating: vi.fn(() => Promise.resolve())
}))

describe('SwimView.vue', () => {
  it('renders map and sidebar', async () => {
    render(SwimView)
    expect(await screen.findByTestId('swim-map')).toBeInTheDocument()
    expect(await screen.findByTestId('filter-sidebar')).toBeInTheDocument()
  })

  it('opens info dialog when beach marker is clicked', async () => {
    render(SwimView)

    const map = await screen.findByTestId('swim-map')
    await fireEvent.click(map)

    expect(await screen.findByTestId('info-dialog')).toBeInTheDocument()
  })

  it('opens planner when open-planner event emitted', async () => {
    render(SwimView)

    const map = await screen.findByTestId('swim-map')
    await fireEvent.click(map)

    const openPlannerBtn = await screen.findByTestId('open-planner')
    await fireEvent.click(openPlannerBtn)

    await waitFor(() => {
      expect(screen.getByTestId('planner')).toBeInTheDocument()
    })
  })

  it('handles search selection from FilterSidebar', async () => {
    render(SwimView)

    const selectBtn = await screen.findByTestId('search-suggestion')
    await fireEvent.click(selectBtn)

    expect(await screen.findByTestId('swim-map')).toBeInTheDocument()
  })

  it('closes dialog on InfoDialog close event', async () => {
    render(SwimView)

    const map = await screen.findByTestId('swim-map')
    await fireEvent.click(map)

    const closeBtn = await screen.findByTestId('close-info')
    await fireEvent.click(closeBtn)

    await waitFor(() => {
      expect(screen.queryByTestId('info-dialog')).not.toBeInTheDocument()
    })
  })
})
