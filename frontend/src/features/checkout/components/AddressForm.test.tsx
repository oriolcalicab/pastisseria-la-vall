import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import AddressForm from './AddressForm'

const emptyAddress = { address: '', city: '', postalCode: '' }

describe('AddressForm', () => {
  it('shows the errors next to each field', () => {
    // Given a postal code with an error
    const errors = { postalCode: 'El codi postal ha de ser de Barcelona (080xx)' }

    // When the form is shown
    render(<AddressForm values={emptyAddress} errors={errors} onChange={vi.fn()} />)

    // Then only that field is marked
    expect(screen.getByLabelText('Codi postal')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Codi postal')).toHaveAccessibleDescription(
      'El codi postal ha de ser de Barcelona (080xx)',
    )
    expect(screen.getByLabelText('Adreça')).not.toHaveAttribute('aria-invalid')
  })

  it('tells which field changed', async () => {
    // Given an empty form
    const onChange = vi.fn()
    render(<AddressForm values={emptyAddress} errors={{}} onChange={onChange} />)

    // When the customer writes in the postal code
    await userEvent.setup().type(screen.getByLabelText('Codi postal'), '0')

    // Then the page is told which field and which value
    expect(onChange).toHaveBeenCalledWith('postalCode', '0')
  })
})