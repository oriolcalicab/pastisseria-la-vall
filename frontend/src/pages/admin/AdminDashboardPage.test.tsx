import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAdminStats } from '../../features/admin/hooks/useAdminStats'
import type { AdminStats } from '../../features/admin/types/stats'
import { formatPrice } from '../../lib/formatPrice'
import AdminDashboardPage from './AdminDashboardPage'

vi.mock('../../features/admin/hooks/useAdminStats', () => ({ useAdminStats: vi.fn() }))
vi.mock('../../features/admin/components/dashboard/SalesBarChart', () => ({
  default: () => <div>Gràfic</div>,
}))

const stats: AdminStats = {
  from: '2026-10-14',
  to: '2026-11-12',
  revenueCents: 12850,
  orderCount: 4,
  ordersByStatus: { pending: 2, preparing: 1, ready: 0, delivered: 1, cancelled: 1 },
  ordersByMethod: { delivery: 1, pickup: 3 },
  topProducts: [{ productName: 'Pastís de xocolata', quantity: 3, revenueCents: 7500 }],
  salesByDay: [
    { date: '2026-11-11', orders: 0, revenueCents: 0 },
    { date: '2026-11-12', orders: 4, revenueCents: 12850 },
  ],
}

const retry = vi.fn()

const renderPage = () =>
  render(
    <MemoryRouter>
      <AdminDashboardPage />
    </MemoryRouter>,
  )

describe('AdminDashboardPage', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 10, 12, 10))
    vi.mocked(useAdminStats).mockReturnValue({ status: 'success', stats, retry })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  it('shows the figures of the last 30 days', () => {
    // Given stats for the last 30 days
    // When the admin opens the dashboard
    renderPage()

    // Then the last 30 days are selected and the figures are shown
    expect(screen.getByRole('heading', { level: 1, name: 'Tauler' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Últims 30 dies' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    const figures = screen.getAllByRole('definition').map((item) => item.textContent)
    expect(figures).toEqual(
      expect.arrayContaining([formatPrice(12850), '4', formatPrice(3213), '2']),
    )
    expect(screen.getByText('Recollida: 3 (75 %)')).toBeInTheDocument()
    expect(screen.getByText('Pastís de xocolata')).toBeInTheDocument()
  })

  it('asks for the new period when the admin picks it', async () => {
    // Given the dashboard
    const user = userEvent.setup()
    renderPage()

    // When the admin picks the last 7 days
    await user.click(screen.getByRole('button', { name: 'Últims 7 dies' }))

    // Then that period is selected and asked for
    expect(screen.getByRole('button', { name: 'Últims 7 dies' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(useAdminStats).toHaveBeenLastCalledWith({ from: '2026-11-06', to: '2026-11-12' })
    expect(screen.getByLabelText('Des de')).toHaveValue('2026-11-06')
  })

  it('does not ask for a period that goes backwards', async () => {
    // Given the dashboard
    const user = userEvent.setup()
    renderPage()

    // When the admin writes a start date after the end date
    const from = screen.getByLabelText('Des de')
    await user.clear(from)
    await user.type(from, '2026-11-20')
    await user.click(screen.getByRole('button', { name: 'Aplica' }))

    // Then the error is shown and the period does not change
    expect(screen.getByRole('alert')).toHaveTextContent(
      "La data d'inici no pot ser posterior a la final.",
    )
    expect(useAdminStats).toHaveBeenLastCalledWith({ from: '2026-10-14', to: '2026-11-12' })
  })

  it('asks for the dates the admin writes', async () => {
    // Given the dashboard
    const user = userEvent.setup()
    renderPage()

    // When the admin writes the first days of November
    const from = screen.getByLabelText('Des de')
    await user.clear(from)
    await user.type(from, '2026-11-01')
    await user.click(screen.getByRole('button', { name: 'Aplica' }))

    // Then no preset is selected and those days are asked for
    expect(useAdminStats).toHaveBeenLastCalledWith({ from: '2026-11-01', to: '2026-11-12' })
    expect(screen.getByRole('button', { name: 'Últims 30 dies' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('shows the sales of each day as a table', async () => {
    // Given the dashboard
    const user = userEvent.setup()
    renderPage()

    // When the admin opens the table of the chart
    await user.click(screen.getByRole('button', { name: 'Veure com a taula' }))

    // Then every day is a row
    const table = screen.getByRole('table', { name: 'Vendes de cada dia' })
    expect(within(table).getAllByRole('row')).toHaveLength(3)
    expect(within(table).getByRole('rowheader', { name: '12/11' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Amaga la taula' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('says when there are no orders in the period', () => {
    // Given a period without orders
    vi.mocked(useAdminStats).mockReturnValue({
      status: 'success',
      stats: {
        ...stats,
        revenueCents: 0,
        orderCount: 0,
        ordersByStatus: { pending: 0, preparing: 0, ready: 0, delivered: 0, cancelled: 0 },
      },
      retry,
    })

    // When the admin opens the dashboard
    renderPage()

    // Then the empty message is shown instead of the figures
    expect(screen.getByText('Encara no hi ha comandes en aquestes dates.')).toBeInTheDocument()
    expect(screen.queryByText('Ingressos')).not.toBeInTheDocument()
  })

  it('shows the loading message', () => {
    // Given stats that are still loading
    vi.mocked(useAdminStats).mockReturnValue({ status: 'loading', retry })

    // When the admin opens the dashboard
    renderPage()

    // Then the loading message is shown
    expect(screen.getByRole('status')).toHaveTextContent('Carregant les dades...')
  })

  it('lets the admin try again after an error', async () => {
    // Given stats that could not be loaded
    const user = userEvent.setup()
    vi.mocked(useAdminStats).mockReturnValue({ status: 'error', retry })
    renderPage()

    // When the admin tries again
    await user.click(screen.getByRole('button', { name: 'Torna-ho a provar' }))

    // Then the stats are asked again
    expect(screen.getByRole('alert')).toHaveTextContent(
      'No hem pogut carregar les dades del tauler.',
    )
    expect(retry).toHaveBeenCalledOnce()
  })
})
