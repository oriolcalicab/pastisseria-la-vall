import type { EventInput } from '@fullcalendar/core'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCalendarOrders } from '../../features/admin/hooks/useCalendarOrders'
import type { CalendarOrder } from '../../features/admin/types/calendar'
import AdminCalendarPage from './AdminCalendarPage'

type FakeCalendarProps = {
  events: EventInput[]
  datesSet: (arg: { start: Date; end: Date }) => void
  eventClick: (arg: { event: { id: string }; jsEvent: { preventDefault: () => void } }) => void
}

type FakePanelProps = {
  orderId: number
  onClose: () => void
  onStatusChange: () => void
}

vi.mock('@fullcalendar/react', async () => {
  const { useEffect } = await import('react')

  const FakeCalendar = ({ events, datesSet, eventClick }: FakeCalendarProps) => {
    useEffect(() => {
      datesSet({ start: new Date(2026, 9, 26), end: new Date(2026, 11, 7) })
    }, [datesSet])

    return (
      <ul aria-label="Calendari">
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
vi.mock('@fullcalendar/list', () => ({ default: {} }))
vi.mock('@fullcalendar/core/locales/ca', () => ({ default: {} }))
vi.mock('../../features/admin/hooks/useCalendarOrders', () => ({ useCalendarOrders: vi.fn() }))
vi.mock('../../features/admin/components/calendar/OrderSummaryPanel', () => ({
  default: ({ orderId, onClose, onStatusChange }: FakePanelProps) => (
    <aside aria-label="Resum de la comanda">
      <p>Comanda {orderId}</p>
      <button type="button" onClick={onStatusChange}>
        Canvia l'estat
      </button>
      <button type="button" onClick={onClose}>
        Tanca
      </button>
    </aside>
  ),
}))

const retry = vi.fn()
const range = { from: '2026-10-26', to: '2026-12-06' }
const noFilters = { status: '', deliveryMethod: '' }

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
      <AdminCalendarPage />
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

    // Then the orders of those days are asked without filters and shown
    expect(useCalendarOrders).toHaveBeenLastCalledWith(range, noFilters)
    expect(screen.getByRole('link', { name: 'LV-261106-4F2A9C · Anna' })).toHaveAttribute(
      'href',
      '/admin/comandes/7',
    )
  })

  it('opens the summary of an order when it is clicked', async () => {
    // Given the calendar with an order
    renderPage()

    // When the admin clicks it
    await userEvent.click(screen.getByRole('link', { name: 'LV-261106-4F2A9C · Anna' }))

    // Then the summary of that order is shown next to the calendar
    const panel = screen.getByRole('complementary', { name: 'Resum de la comanda' })
    expect(within(panel).getByText('Comanda 7')).toBeInTheDocument()

    // And it can be closed
    await userEvent.click(within(panel).getByRole('button', { name: 'Tanca' }))
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
  })

  it('asks the calendar again when the status changes in the summary', async () => {
    // Given the summary of an order
    renderPage()
    await userEvent.click(screen.getByRole('link', { name: 'LV-261106-4F2A9C · Anna' }))

    // When the admin changes its status
    await userEvent.click(screen.getByRole('button', { name: "Canvia l'estat" }))

    // Then the orders of the calendar are asked again
    expect(retry).toHaveBeenCalledOnce()
  })

  it('asks for the orders of the filters', async () => {
    // Given the calendar
    renderPage()

    // When the admin wants the ready orders to deliver at home
    await userEvent.selectOptions(screen.getByLabelText('Estat'), 'Llesta')
    await userEvent.selectOptions(screen.getByLabelText("Tipus d'entrega"), 'A domicili')

    // Then the backend is asked with both filters
    expect(useCalendarOrders).toHaveBeenLastCalledWith(range, {
      status: 'ready',
      deliveryMethod: 'delivery',
    })
  })

  it('explains the colour of each status', () => {
    // Given the calendar
    // When the admin opens the page
    renderPage()

    // Then the legend has every status
    const legend = screen.getByRole('list', { name: 'Colors dels estats' })
    expect(
      within(legend)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['Pendent', 'En preparació', 'Llesta', 'Entregada', 'Cancel·lada'])
  })
})
