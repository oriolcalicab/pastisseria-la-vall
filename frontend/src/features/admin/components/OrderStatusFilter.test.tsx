import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import OrderStatusFilter from './OrderStatusFilter'

describe('OrderStatusFilter', () => {
  it('sends the chosen status', async () => {
    // Given the filter with all the statuses
    const onChange = vi.fn()
    render(<OrderStatusFilter value="" onChange={onChange} />)

    // When the admin chooses "Llesta"
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Estat' }), 'Llesta')

    // Then the status is sent
    expect(onChange).toHaveBeenCalledWith('ready')
  })
})
