//npx vitest run --reporter=verbose 
import { render, fireEvent, screen } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import CalendarDialog from '@/components/ui/CalendarDialog.vue'

describe('CalendarDialog.vue', () => {
  const baseProps = {
    selectedDate: '2025-10-10',
    selectedTime: '15:30',
    placeType: 'beach',
    selectedPlaceId: 'beach-001',
    userEmail: 'test@example.com',
    showEmailInput: true,
    places: [
      { id: 'beach-001', name: 'St Kilda Beach' },
      { id: 'river-002', name: 'Yarra River' },
    ],
  }

  it('renders form inputs correctly', () => {
    render(CalendarDialog, {
      props: baseProps
    })

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Time/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Place Type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument()
  })

  it('emits close when close button is clicked', async () => {
    const { emitted } = render(CalendarDialog, { props: baseProps })

    const closeBtn = screen.getByRole('button', { name: /close/i })
    await fireEvent.click(closeBtn)

    expect(emitted()).toHaveProperty('close')
  })

  it('emits submit when valid form is submitted', async () => {
    const { emitted } = render(CalendarDialog, { props: baseProps })

    const submitBtn = screen.getByRole('button', { name: /submit/i })
    await fireEvent.click(submitBtn)

    expect(emitted()).toHaveProperty('submit')
  })

  it('disables submit button when form is invalid (no email)', () => {
    render(CalendarDialog, {
      props: {
        ...baseProps,
        userEmail: '',
        showEmailInput: true
      }
    })

    const submitBtn = screen.getByRole('button', { name: /submit/i })
    expect(submitBtn).toBeDisabled()
  })

  it('emits close when backdrop is clicked', async () => {
    const { emitted } = render(CalendarDialog, { props: baseProps })

    const backdrop = screen.getByTestId('calendar-backdrop')
    await fireEvent.click(backdrop)

    expect(emitted()).toHaveProperty('close')
  })
})
