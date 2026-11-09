import { describe, expect, it } from 'vitest'
import { parseStatusBody } from './statusBody.js'

describe('parseStatusBody', () => {
  it('returns the new status', () => {
    // Given a body with a known status
    // When it is parsed
    // Then the status is returned
    expect(parseStatusBody({ status: 'preparing' })).toEqual({ status: 'preparing' })
  })

  it('returns null when the status does not exist', () => {
    // Given a body with an unknown status
    // When it is parsed
    // Then null is returned
    expect(parseStatusBody({ status: 'lost' })).toBeNull()
  })

  it('returns null when there is no status', () => {
    // Given an empty body
    // When it is parsed
    // Then null is returned
    expect(parseStatusBody({})).toBeNull()
  })
})
