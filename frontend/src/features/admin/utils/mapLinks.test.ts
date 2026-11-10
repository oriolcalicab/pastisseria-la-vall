import { describe, expect, it } from 'vitest'
import { getMapSearchUrl } from './mapLinks'

describe('getMapSearchUrl', () => {
  it('builds the Google Maps link of an address', () => {
    // Given the address of a home delivery
    const address = { address: 'Carrer de Mallorca, 120', postalCode: '08036', city: 'Barcelona' }

    // When the link is built
    // Then the address is encoded in the search
    expect(getMapSearchUrl(address)).toBe(
      'https://www.google.com/maps/search/?api=1&query=Carrer%20de%20Mallorca%2C%20120%2C%2008036%20Barcelona',
    )
  })
})
