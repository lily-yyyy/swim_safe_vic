import { render, fireEvent, screen } from '@testing-library/vue'
import ToiletInfo from '@/components/ui/ToiletInfo.vue'
import { describe, it, expect, vi } from 'vitest'

const mockToilet = {
  id: 1,
  toilet_name: 'Test Toilet',
  averageRating: 4.2,
  openingHours: '6am - 10pm',
  unisex: false,
  male: true,
  female: true,
  accessible: true,
  allGender: true,
  babyChange: true,
  comments: [
    { id: 1, comment: 'Nice and clean!', created_at: '2023-10-08T10:00:00Z' },
  ],
  getDirections: vi.fn(),
}

describe('ToiletInfo.vue', () => {
  it('renders toilet details correctly', () => {
    render(ToiletInfo, {
      props: { toilet: mockToilet },
    })

    expect(screen.getByText('Test Toilet')).toBeInTheDocument()
    expect(screen.getByText(/4.2/)).toBeInTheDocument()
    expect(screen.getByText('6am - 10pm')).toBeInTheDocument()
    expect(screen.getByText('Available')).toBeInTheDocument()
    expect(screen.getByText(/Nice and clean!/)).toBeInTheDocument()
  })

  it('emits close event on cancel button click', async () => {
    const { emitted } = render(ToiletInfo, {
      props: { toilet: mockToilet },
    })

    await fireEvent.click(screen.getByText('Cancel'))

    expect(emitted().close).toBeTruthy()
  })

  it('calls getDirections and emits close when Directions clicked', async () => {
    const { emitted } = render(ToiletInfo, {
      props: { toilet: mockToilet },
    })

    await fireEvent.click(screen.getByText(/Directions/))

    expect(mockToilet.getDirections).toHaveBeenCalled()
    expect(emitted().close).toBeTruthy()
  })

  it('emits submit event with correct form data', async () => {
    const { emitted } = render(ToiletInfo, {
      props: { toilet: mockToilet },
    })

    // Set cleanStatus to 'no'
    const noRadio = screen.getByLabelText('No')
    await fireEvent.click(noRadio)

    // Click 3rd star
    const stars = screen.getAllByText('★')
    await fireEvent.click(stars[2]) // star index 2 = rating 3

    // Write a comment
    const textarea = screen.getByPlaceholderText(/share your experience/i)
    await fireEvent.update(textarea, 'Great toilet!')

    // Submit
    await fireEvent.click(screen.getByText('Submit'))

    expect(emitted().submit).toBeTruthy()
    const submittedData = emitted().submit[0][0]

    expect(submittedData).toEqual({
      toiletId: 1,
      isClean: false,
      rating: 3,
      comment: 'Great toilet!',
    })
  })

  it('renders fallback when no comments', () => {
    const toiletNoComments = { ...mockToilet, comments: [] }
    render(ToiletInfo, {
      props: { toilet: toiletNoComments },
    })

    expect(screen.getByText('No comments yet')).toBeInTheDocument()
  })
})
