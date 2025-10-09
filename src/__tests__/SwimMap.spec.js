import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import SwimMap from '@/features/swim/components/SwimMap.vue'
import { vi } from 'vitest'

// Mock Google Maps components
vi.mock('vue3-google-map', () => ({
  GoogleMap: {
    name: 'GoogleMap',
    template: '<div><slot /></div>',
    props: ['apiKey', 'mapId', 'center', 'zoom']
  },
  Marker: {
    name: 'Marker',
    props: ['options'],
    template: '<div role="button" data-testid="marker" @click="$emit(\'click\')"></div>'
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
      avg_enterococci: 100,
      description_tips: 'Clean beach'
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
      predicted: {
        category: 'Excellent',
        wqi: 95
      },
      description: 'A safe river'
    }
  ]))
}))

vi.mock('@/api/webapi/toilet_api', () => ({
  getToiletById: vi.fn(() => Promise.resolve({
    id: 1,
    name: 'Test Toilet',
    lat: -37.86,
    lon: 144.97
  }))
}))

vi.mock('@/api/weather', () => ({
  getWeatherByCoords: vi.fn(() => Promise.resolve({
    main: { temp: 25 }
  }))
}))

// Mock child marker components
vi.mock('@/features/swim/components/ToiletMarkers.vue', () => ({
  default: {
    name: 'ToiletMarkers',
    emits: ['marker-clicked'],
    template: '<div data-testid="toilet-marker" @click="$emit(\'marker-clicked\', { id: 1, type: \'toilet\', lat: -37.86, lon: 144.97 })"></div>'
  }
}))

vi.mock('@/features/swim/components/FountainMarkers.vue', () => ({
  default: {
    name: 'FountainMarkers',
    emits: ['marker-clicked'],
    template: '<div data-testid="fountain-marker" @click="$emit(\'marker-clicked\', { id: 2, type: \'fountain\', lat: -37.85, lon: 144.96 })"></div>'
  }
}))

// Mock geolocation
beforeAll(() => {
  global.navigator.geolocation = {
    getCurrentPosition: vi.fn((success) =>
      success({
        coords: {
          latitude: -37.85,
          longitude: 144.96
        }
      })
    )
  }

  // Optional: mock Google maps service (for getDirections)
  global.window.google = {
    maps: {
      TravelMode: {
        DRIVING: 'DRIVING'
      },
      DirectionsService: vi.fn().mockImplementation(() => ({
        route: (req, callback) => {
          callback({ routes: [] }, 'OK')
        }
      })),
      DirectionsRenderer: vi.fn().mockImplementation(() => ({
        setDirections: vi.fn()
      }))
    }
  }
})

describe('SwimMap.vue', () => {
  it('renders GoogleMap and markers', async () => {
    render(SwimMap, {
      props: {
        filters: {
          showOnMap: 'all',
          waterQuality: null,
          distance: null,
          amenities: []
        },
        searchQuery: '',
        zoomTarget: null
      }
    })

    // Wait for markers to load
    const markers = await screen.findAllByTestId('marker')
    expect(markers.length).toBeGreaterThan(0)
  })

  it('shows toilet and fountain markers when amenities selected', async () => {
    const { getByTestId } = render(SwimMap, {
      props: {
        filters: {
          showOnMap: 'all',
          waterQuality: null,
          distance: null,
          amenities: ['toilets', 'fountains']
        },
        searchQuery: '',
        zoomTarget: null
      }
    })

    // Wait for and click toilet marker
    const toilet = await getByTestId('toilet-marker')
    await fireEvent.click(toilet)

    // Click fountain marker
    const fountain = await getByTestId('fountain-marker')
    await fireEvent.click(fountain)
  })

  it('emits marker-clicked when marker is clicked', async () => {
    const { emitted } = render(SwimMap, {
      props: {
        filters: {
          showOnMap: 'all',
          waterQuality: null,
          distance: null,
          amenities: []
        },
        searchQuery: '',
        zoomTarget: null
      }
    })

    // Wait for markers and click the first
    const markers = await screen.findAllByTestId('marker')
    await fireEvent.click(markers[0])

    await waitFor(() => {
      expect(emitted()['marker-clicked']).toBeTruthy()
    })

    const emittedPayload = emitted()['marker-clicked'][0][0]
    expect(emittedPayload.name).toBe('Test Beach')
    expect(typeof emittedPayload.getDirections).toBe('function')
  })
})
