// src/__tests__/FilterSidebar.spec.js
import { render, fireEvent, screen, within } from '@testing-library/vue'
import FilterSidebar from '@/features/swim/components/FilterSidebar.vue'
import { describe, it, expect } from 'vitest'

const mockResults = [
  { name: 'St Kilda Beach', status: 'Safe', description: 'Popular Melbourne beach' },
  { name: 'Yarra River', status: 'Caution', description: 'Inner-city river' }
]

describe('FilterSidebar.vue', () => {
  it('renders search input and filters', () => {
    render(FilterSidebar, { props: { results: mockResults } })

    expect(screen.getByPlaceholderText('Search beach, river location')).toBeInTheDocument()
    expect(screen.getByText('Filters')).toBeInTheDocument()
    expect(screen.getByText('Show on Map')).toBeInTheDocument()
    expect(screen.getByText('Water Quality')).toBeInTheDocument()
    expect(screen.getByText('Distance')).toBeInTheDocument()
    expect(screen.getByText('Amenities')).toBeInTheDocument()
  })

  it('emits update:search when typing in search input', async () => {
    const { emitted } = render(FilterSidebar, { props: { results: mockResults } })
    const input = screen.getByPlaceholderText('Search beach, river location')

    await fireEvent.update(input, 'St')
    // The component watches searchQuery and emits update:search
    expect(emitted()['update:search']).toBeTruthy()
    // The first emission should contain the typed value
    expect(emitted()['update:search'][0]).toEqual(['St'])
  })

  it('displays search suggestions and emits on selection', async () => {
    const { emitted } = render(FilterSidebar, { props: { results: mockResults } })
    const input = screen.getByPlaceholderText('Search beach, river location')

    await fireEvent.update(input, 'St')

    // Scope to the suggestion list (<ul class="search-suggestions">)
    const suggestionList = await screen.findByRole('list')
    const suggestion = within(suggestionList).getByText('St Kilda Beach')

    expect(suggestion).toBeInTheDocument()
    await fireEvent.click(suggestion)

    // Ensure event emitted with the selected item
    expect(emitted()['search-selected']).toBeTruthy()
    expect(emitted()['search-selected'][0][0]).toEqual(mockResults[0])
  })

  it('emits update:filters when clicking filter buttons (scoped to button)', async () => {
    const { emitted } = render(FilterSidebar, { props: { results: mockResults } })

    // The text "Safe" appears both as a button label and as a status label in results.
    // Use getAllByText and pick the element whose tagName is BUTTON.
    const matches = screen.getAllByText('Safe')
    const safeButton = matches.find((el) => el.tagName === 'BUTTON' || el.nodeName === 'BUTTON')

    // Sanity check
    expect(safeButton).toBeTruthy()

    await fireEvent.click(safeButton)

    // The update:filters watcher emits the new filters object
    expect(emitted()['update:filters']).toBeTruthy()
    // Grab the last emitted filters object
    const lastFilters = emitted()['update:filters'].at(-1)[0]
    expect(lastFilters).toHaveProperty('waterQuality', 'safe')
  })

  it('resets filters when reset button is clicked', async () => {
    const { emitted } = render(FilterSidebar, { props: { results: mockResults } })

    // Set a filter first (click Unsafe)
    const unsafeMatches = screen.getAllByText('Unsafe')
    const unsafeButton = unsafeMatches.find((el) => el.tagName === 'BUTTON' || el.nodeName === 'BUTTON')
    if (unsafeButton) await fireEvent.click(unsafeButton)

    // Now click Reset
    const resetBtn = screen.getByText('Reset')
    await fireEvent.click(resetBtn)

    // Should have emitted update:filters with reset values
    expect(emitted()['update:filters']).toBeTruthy()
    const latest = emitted()['update:filters'].at(-1)[0]
    expect(latest.waterQuality).toBeNull()
    expect(latest.distance).toBeNull()
    expect(Array.isArray(latest.amenities)).toBe(true)
    expect(latest.amenities.length).toBe(0)

    // Search input should be cleared as part of reset (component sets searchQuery = '')
    const searchInput = screen.getByPlaceholderText('Search beach, river location')
    expect(searchInput.value).toBe('')
  })

  it('shows fallback text when no results match (flexible text matcher)', async () => {
    render(FilterSidebar, { props: { results: [] } })

    const input = screen.getByPlaceholderText('Search beach, river location')
    await fireEvent.update(input, 'nonexistent location')

    // The fallback contains emoji + <strong class="no-results">No results match your filters or search.</strong>
    // Use a function matcher to check the text content includes the expected phrase.
    const fallback = await screen.findByText((content, node) => {
      return content && content.toLowerCase().includes('no results match your filters or search')
    })

    expect(fallback).toBeInTheDocument()
  })
})
