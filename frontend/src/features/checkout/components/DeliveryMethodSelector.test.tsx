import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import DeliveryMethodSelector from './DeliveryMethodSelector'

describe('DeliveryMethodSelector', () => {
  it('shows both methods and marks the chosen one', () => {
    // Given the pickup is chosen
    // When the selector is shown
    render(<DeliveryMethodSelector value="pickup" onChange={vi.fn()} />)

    // Then both methods can be chosen and pickup is checked
    expect(screen.getByRole('radio', { name: /Lliurament a domicili/ })).not.toBeChecked()
    expect(screen.getByRole('radio', { name: /Recollida en un punt/ })).toBeChecked()
  })

  it('tells which method was chosen', async () => {
    // Given no method chosen
    const onChange = vi.fn()
    render(<DeliveryMethodSelector value={null} onChange={onChange} />)

    // When the customer chooses home delivery
    await userEvent.setup().click(screen.getByRole('radio', { name: /Lliurament a domicili/ }))

    // Then the page is told
    expect(onChange).toHaveBeenCalledWith('delivery')
  })
})