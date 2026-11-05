import { describe, expect, it } from 'vitest'
import type { ShippingAddress } from '../types/checkout'
import { validateShippingAddress } from './shippingAddress'

const validAddress: ShippingAddress = {
  address: 'Carrer de Mallorca, 120, 3r 1a',
  city: 'Barcelona',
  postalCode: '08036',
}

describe('validateShippingAddress', () => {
  it('returns the address without extra spaces', () => {
    // Given a valid address with spaces around the values
    const values = {
      address: '  Carrer de Mallorca, 120, 3r 1a ',
      city: ' Barcelona ',
      postalCode: ' 08036 ',
    }

    // When the address is validated
    // Then the clean address is returned
    expect(validateShippingAddress(values)).toEqual({ ok: true, address: validAddress })
  })

  it('returns all the errors of an empty address at once', () => {
    // Given an empty address
    const values = { address: '', city: '', postalCode: '' }

    // When the address is validated
    // Then every field has its error
    expect(validateShippingAddress(values)).toEqual({
      ok: false,
      errors: {
        address: 'Escriu el carrer, el número i, si cal, el pis',
        city: 'Escriu la població',
        postalCode: 'El codi postal ha de ser de Barcelona (080xx)',
      },
    })
  })

  it.each(['08001', '08042', '08099'])('accepts the postal code %s', (postalCode) => {
    // Given a postal code of Barcelona
    // When the address is validated
    // Then it is accepted
    expect(validateShippingAddress({ ...validAddress, postalCode }).ok).toBe(true)
  })

  it.each(['08100', '28001', '0801', '080011', 'abcde'])(
    'rejects the postal code %s',
    (postalCode) => {
      // Given a postal code that is not of Barcelona
      // When the address is validated
      // Then the postal code has an error
      expect(validateShippingAddress({ ...validAddress, postalCode })).toMatchObject({
        ok: false,
        errors: { postalCode: 'El codi postal ha de ser de Barcelona (080xx)' },
      })
    },
  )

  it('rejects an address that is too long', () => {
    // Given an address with more than 200 characters
    const values = { ...validAddress, address: 'a'.repeat(201) }

    // When the address is validated
    // Then the address has an error
    expect(validateShippingAddress(values)).toMatchObject({
      ok: false,
      errors: { address: 'Escriu el carrer, el número i, si cal, el pis' },
    })
  })
})