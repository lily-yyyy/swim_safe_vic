import { mount, flushPromises } from '@vue/test-utils'
// import LearnView from '@/views/learn/LearnView.vue'
import LearnView from '../features/learn/LearnView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, screen, waitFor } from '@testing-library/vue'




//  Mock scrollIntoView to prevent errors in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn()

describe('LearnView.vue', () => {
  it('renders heading and call-to-action', async () => {
    render(LearnView)

    expect(await screen.findByText(/learn with us/i)).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /explore parameters/i })).toBeInTheDocument()
  })

  it('renders parameter swiper with slides', async () => {
    render(LearnView)

    const swiper = await screen.findByTestId('swiper')
    expect(swiper).toBeInTheDocument()

    const slides = await screen.findAllByTestId('swiper-slide')
    expect(slides.length).toBeGreaterThan(0)
  })

  it('renders correct RainIcon labels', async () => {
    render(LearnView)

    const rainIcons = await screen.findAllByTestId('rain-icon')
    const labels = rainIcons.map(i => i.textContent?.trim())

    expect(labels).toEqual(expect.arrayContaining([
      'Excellent (80-100): Safe to swim',
      'Good (70-79): Usually safe',
      'Moderate (50-69): Be careful',
      'Poor (30-49): Avoid swimming',
      'Very Poor (0-29): Stay out!',
      'Before Rain',
      'Rain',
      '0–2 Days',
      '3–14 Days',
    ]))
  })

  it('renders 3 ProtectCard components with correct titles', async () => {
    render(LearnView)

    // Find all ProtectCard headings (h6)
    const headings = await screen.findAllByRole('heading', { level: 6 })
    const protectTitles = headings
      .map(h => h.textContent?.trim())
      .filter(t => ['Before', 'During', 'After'].includes(t))

    expect(protectTitles).toEqual(expect.arrayContaining(['Before', 'During', 'After']))
    expect(protectTitles.length).toBe(3)
  })
})
