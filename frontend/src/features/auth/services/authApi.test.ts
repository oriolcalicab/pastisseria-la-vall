import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchCurrentUser, registerInBackend } from './authApi'

describe('registerInBackend', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends the token and the name to the backend', async () => {
    // Given a backend that answers correctly
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    // When the user is registered in the backend
    await registerInBackend('token-123', 'Oriol')

    // Then the request carries the Bearer token and the name
    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer token-123' }),
        body: JSON.stringify({ name: 'Oriol' }),
      }),
    )
  })

  it('throws when the backend answers with an error', async () => {
    // Given a backend that rejects the token
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401 }))

    // When the user is registered in the backend
    // Then the call fails
    await expect(registerInBackend('bad-token', 'Oriol')).rejects.toThrow()
  })
})

describe('fetchCurrentUser', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends the token and returns the user with the role', async () => {
    // Given a backend that returns an admin user
    const user = { id: 1, name: 'Oriol', email: 'oriol@test.com', role: 'admin' }
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => user })
    vi.stubGlobal('fetch', fetchMock)

    // When the current user is requested
    const result = await fetchCurrentUser('token-123')

    // Then the request carries the Bearer token and the user is returned
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/me'),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer token-123' }),
      }),
    )
    expect(result).toEqual(user)
  })

  it('throws when the backend answers with an error', async () => {
    // Given a backend that does not know the user
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401 }))

    // When the current user is requested
    // Then the call fails
    await expect(fetchCurrentUser('bad-token')).rejects.toThrow()
  })
})