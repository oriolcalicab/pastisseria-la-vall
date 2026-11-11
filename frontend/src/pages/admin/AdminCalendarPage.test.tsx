import type { EventInput } from '@fullcalendar/core'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCalendarOrders } from '../../features/admin/hooks/useCalendarOrders'
import type { CalendarOrder } from '../../features/admin/types/calendar'
import AdminCalendarPage from './AdminCalendarPage'

type FakeCalendarProps = {
  events: EventInput[]
  datesSet: (arg: { start: Date; end: Date }) => void
  eventClick: (arg: { event: { id: string }; jsEvent: { preventDefault: () => void } }) => void
}

vi.mock('@fullcalendar/react', async () => {
  const { useEffect } = await import('react')

  const FakeCalendar = ({ events, datesSet, eventClick }: FakeCalendarProps) => {
    useEffect(() => {
      datesSet({ start: new Date(2026, 9, 26), end: new Date(2026, 11, 7) })
    }, [datesSet])

    return (
      <ul>
        {events.map((event) => (
          <li key={String(event.id)}>
            <a
              href={event.url}
              onClick={(jsEvent) => eventClick({ event: { id: String(event.id) }, jsEvent })}
            >
              {event.title}
            </a>
          </li>
        ))}
      </ul>
    )
  }

  return { default: FakeCalendar }
})
vi.mock('@fullcalendar/daygrid', () => ({ default: {} }))
vi.mock('@fullcalendar/core/locales/ca', () => ({ default: {} }))
vi.mock('../../features/admin/hooks/useCalendarOrders', () => ({ useCalendarOrders: vi.fn() }))

const retry = vi.fn()

const order: CalendarOrder = {
  id: 7,
  orderNumber: 'LV-261106-4F2A9C',
  status: 'pending',
  deliveryMethod: 'pickup',
  deliveryDate: '2026-11-12',
  user: { name: 'Anna' },
}

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/admin/calendari']}>
      <Routes>
        <Route path="/admin/calendari" element={<AdminCalendarPage />} />
        <Route path="/admin/comandes/:id" element={<p>Detall de la comanda</p>} />
      </Routes>
    </MemoryRouter>,
  )

describe('AdminCalendarPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(useCalendarOrders).mockReturnValue({ status: 'success', orders: [order], retry })
  })

  it('asks for the orders of the days shown and puts them in the calendar', () => {
    // Given a calendar that shows from the 26th of October to the 6th of December
    // When the admin opens the page
    renderPage()

    // Then the orders of those days are asked and shown
    expect(useCalendarOrders).toHaveBeenLastCalledWith({ from: '2026-10-26', to: '2026-12-06' })
    expect(screen.getByRole('link', { name: 'LV-261106-4F2A9C · Anna' })).toHaveAttribute(
      'href',
      '/admin/comandes/7',
    )
  })

  it('opens the detail of an order when it is clicked', async () => {
    // Given the calendar with an order
    renderPage()

    // When the admin clicks it
    await userEvent.click(screen.getByRole('link', { name: 'LV-261106-4F2A9C · Anna' }))

    // Then the detail of the order is shown
    expect(screen.getByText('Detall de la comanda')).toBeInTheDocument()
  })
})
