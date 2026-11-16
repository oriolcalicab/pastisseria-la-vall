import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import CalendarFilters from './CalendarFilters'

describe('CalendarFilters', () => {
  it('sends the status and keeps the delivery method', async () => {
    // Given the filters with the orders to pick up
    const onChange = vi.fn()
    render(<CalendarFilters value={{ status: '', deliveryMethod: 'pickup' }} onChange={onChange} />)

    // When the admin picks the ready orders
    await userEvent.selectOptions(screen.getByLabelText('Estat'), 'Llesta')

    // Then both filters are sent
    expect(onChange).toHaveBeenCalledWith({ status: 'ready', deliveryMethod: 'pickup' })
  })

  it('sends the delivery method and keeps the status', async () => {
    // Given the filters with the pending orders
    const onChange = vi.fn()
    render(
      <CalendarFilters value={{ status: 'pending', deliveryMethod: '' }} onChange={onChange} />,
    )

    // When the admin picks the home deliveries
    await userEvent.selectOptions(screen.getByLabelText("Tipus d'entrega"), 'A domicili')

    // Then both filters are sent
    expect(onChange).toHaveBeenCalledWith({ status: 'pending', deliveryMethod: 'delivery' })
  })
})
