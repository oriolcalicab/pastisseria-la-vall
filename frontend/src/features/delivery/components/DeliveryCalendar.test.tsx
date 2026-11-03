import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDeliveryDates } from '../hooks/useDeliveryDates'
import type { DeliveryDay } from '../types/delivery'
import DeliveryCalendar from './DeliveryCalendar'

vi.mock('../hooks/useDeliveryDates', () => ({ useDeliveryDates: vi.fn() }))

const retry = vi.fn()

const novemberDays: DeliveryDay[] = Array.from({ length: 30 }, (_, index) => {
  const date = `2026-11-${String(index + 1).padStart(2, '0')}`

  if (index < 4) return { date, available: false, reason: index === 0 ? 'past' : 'too_soon' }
  if (date === '2026-11-08') return { date, available: false, reason: 'sunday' }

  return { date, available: true, reason: null }
})

const renderCalendar = (selectedDate: string | null = null) => {
  const onSelect = vi.fn()
  render(
    <DeliveryCalendar initialMonth="2026-11" selectedDate={selectedDate} onSelect={onSelect} />,
  )

  return { onSelect }
}

const dayButton = (name: RegExp) => screen.getByRole('button', { name })

describe('DeliveryCalendar', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(useDeliveryDates).mockReturnValue({ status: 'success', days: novemberDays, retry })
  })

  it('shows a message while the dates are loading', () => {
    // Given the dates are loading
    vi.mocked(useDeliveryDates).mockReturnValue({ status: 'loading', retry })

    // When the calendar is shown
    renderCalendar()

    // Then the month and the loading message are shown
    expect(screen.getByRole('heading', { name: /novembre/ })).toBeInTheDocument()
    expect(screen.getByText('Carregant les dates...')).toBeInTheDocument()
  })

  it('shows an error and lets the user retry', async () => {
    // Given the dates could not be loaded
    vi.mocked(useDeliveryDates).mockReturnValue({ status: 'error', retry })
    renderCalendar()

    // When the user clicks retry
    await userEvent.setup().click(screen.getByRole('button', { name: 'Torna-ho a provar' }))

    // Then the dates are requested again
    expect(retry).toHaveBeenCalledOnce()
  })

  it('selects an available day', async () => {
    // Given the calendar
    const { onSelect } = renderCalendar()

    // When the user clicks an available day
    await userEvent.setup().click(dayButton(/^dijous.*5.*novembre$/))

    // Then the day is selected
    expect(onSelect).toHaveBeenCalledWith('2026-11-05')
  })

  it('does not select a blocked day and explains why', async () => {
    // Given a Sunday
    const { onSelect } = renderCalendar()
    const sunday = dayButton(/diumenge.*8.*novembre/)

    // When the user clicks it
    await userEvent.setup().click(sunday)

    // Then it is not selected and its label has the reason
    expect(onSelect).not.toHaveBeenCalled()
    expect(sunday).toHaveAttribute('aria-disabled', 'true')
    expect(sunday).toHaveAccessibleName(/els diumenges no fem lliuraments/)
  })

  it('shows the selected day', () => {
    // Given a selected day
    // When the calendar is shown
    renderCalendar('2026-11-05')

    // Then the day is pressed and its name is shown
    expect(dayButton(/^dijous.*5.*novembre$/)).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(/Data triada: dijous/)).toBeInTheDocument()
  })

  it('moves between the days with the arrow keys', async () => {
    // Given the focus on Thursday 5
    renderCalendar()
    const user = userEvent.setup()
    await user.click(dayButton(/^dijous.*5.*novembre$/))

    // When the user presses the right arrow and then the down arrow
    await user.keyboard('{ArrowRight}')
    expect(dayButton(/^divendres.*6.*novembre$/)).toHaveFocus()
    await user.keyboard('{ArrowDown}')

    // Then the focus is one week later
    expect(dayButton(/^divendres.*13.*novembre$/)).toHaveFocus()
  })

  it('only lets one day receive the focus with the tab key', () => {
    // Given the calendar
    // When it is shown
    renderCalendar()

    // Then only one day can be reached with tab
    const focusableDays = screen
      .getAllByRole('button')
      .filter((button) => button.dataset.date && button.tabIndex === 0)
    expect(focusableDays).toHaveLength(1)
  })

  it('changes the month with the arrow keys', async () => {
    // Given the focus on the last day of the month
    renderCalendar()
    const user = userEvent.setup()
    await user.click(dayButton(/^dilluns.*30.*novembre$/))

    // When the user presses the right arrow
    await user.keyboard('{ArrowRight}')

    // Then the next month is requested
    expect(useDeliveryDates).toHaveBeenLastCalledWith('2026-12')
  })

  it('moves to the next month but not before the first one', async () => {
    // Given the calendar on the first month
    renderCalendar()
    const previous = screen.getByRole('button', { name: '« Anterior' })
    expect(previous).toBeDisabled()

    // When the user goes to the next month
    await userEvent.setup().click(screen.getByRole('button', { name: 'Següent »' }))

    // Then December is shown and the previous button can be used
    expect(screen.getByRole('heading', { name: /desembre/ })).toBeInTheDocument()
    expect(previous).toBeEnabled()
  })
})