import { render, screen, fireEvent } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import LocationInfo from '@/components/ui/InfoDialog.vue'

// Mock location prop
const mockLocation = {
  name: 'St Kilda Beach',
  status: 'Surveillance',
  lastTested: '2023-10-05',
  temperature: 21,
  description: 'Popular beach near Melbourne.',
  distance: '5.4 km',
  time: '12 mins',
  lat: -37.8676,
  lon: 144.9809,
  id: 'place_id_123'
}

describe('LocationInfo.vue', () => {
  it('renders all expected location info', () => {
    render(LocationInfo, {
      props: { location: mockLocation }
    })

    expect(screen.getByText('St Kilda Beach')).toBeTruthy()
    expect(screen.getByText('You can swim today')).toBeTruthy()
    expect(screen.getByText('Popular beach near Melbourne.')).toBeTruthy()
    expect(screen.getByText('5.4 km')).toBeTruthy()
    expect(screen.getByText('12 mins')).toBeTruthy()
    expect(screen.getByText('21°C')).toBeTruthy()
  })

  it('applies correct classes for status = Surveillance', () => {
    render(LocationInfo, {
      props: { location: mockLocation }
    })

    const badge = screen.getByText('Surveillance')
    expect(badge.classList.contains('bg-success')).toBe(true)

    const advice = screen.getByText('You can swim today')
    expect(advice.classList.contains('text-success')).toBe(true)
  })

  it('emits close when close button is clicked', async () => {
    const { emitted } = render(LocationInfo, {
      props: { location: mockLocation }
    })

    const closeBtn = screen.getByRole('button', { name: 'Close' }) // ✅ Fix: use aria-label
    await fireEvent.click(closeBtn)

    expect(emitted()).toHaveProperty('close')
  })

  it('emits open-planner with location when planner button is clicked', async () => {
    const { emitted } = render(LocationInfo, {
      props: { location: mockLocation }
    })

    const plannerButton = screen.getByRole('button', { name: /Planner/i })
    await fireEvent.click(plannerButton)

    expect(emitted()).toHaveProperty('open-planner')
    expect(emitted()['open-planner'][0][0]).toEqual(mockLocation) // ✅ Match payload
  })

  it('opens Google Maps with correct URL when Directions clicked', async () => {
    window.open = vi.fn()

    render(LocationInfo, {
      props: { location: mockLocation }
    })

    const directionsBtn = screen.getByRole('button', { name: /Directions/i })
    await fireEvent.click(directionsBtn)

    const expectedUrl = `https://www.google.com/maps/dir/?api=1&destination=${mockLocation.lat},${mockLocation.lon}&destination_place_id=${mockLocation.id}`

    expect(window.open).toHaveBeenCalledWith(expectedUrl, '_blank')
  })

  it('alerts if lat/lon are missing on Directions click', async () => {
    window.alert = vi.fn()

    const mockWithoutCoords = { ...mockLocation, lat: null, lon: null }

    render(LocationInfo, {
      props: { location: mockWithoutCoords }
    })

    const directionsBtn = screen.getByRole('button', { name: /Directions/i })
    await fireEvent.click(directionsBtn)

    expect(window.alert).toHaveBeenCalledWith('No coordinates available for this location.')
  })
})