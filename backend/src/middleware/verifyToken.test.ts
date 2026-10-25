import type { NextFunction, Request, Response } from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { verifyFirebaseToken } from '../services/tokenService.js'
import { verifyToken } from './verifyToken.js'

vi.mock('../services/tokenService.js', () => ({ verifyFirebaseToken: vi.fn() }))

const createResponse = () => {
  const res = { locals: {}, status: vi.fn(), json: vi.fn() }
  res.status.mockReturnValue(res)
  return res
}

const callMiddleware = async (authorization?: string) => {
  const req = { headers: { authorization } } as unknown as Request
  const res = createResponse()
  const next = vi.fn()

  await verifyToken(req, res as unknown as Response, next as NextFunction)

  return { res, next }
}

describe('verifyToken', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('responds 401 when the token is missing', async () => {
    // Given a request without Authorization header
    // When the middleware runs
    const { res, next } = await callMiddleware(undefined)

    // Then the request is rejected with 401
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('responds 401 when the token is invalid or expired', async () => {
    // Given a token that Firebase rejects
    vi.mocked(verifyFirebaseToken).mockRejectedValue(new Error('expired'))

    // When the middleware runs
    const { res, next } = await callMiddleware('Bearer expired-token')

    // Then the request is rejected with 401
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('stores the Firebase user and continues when the token is valid', async () => {
    // Given a token that Firebase accepts
    vi.mocked(verifyFirebaseToken).mockResolvedValue({ uid: 'u1', email: 'a@b.com' })

    // When the middleware runs
    const { res, next } = await callMiddleware('Bearer good-token')

    // Then the user is available in res.locals and the request continues
    expect(res.locals).toEqual({ firebaseUser: { uid: 'u1', email: 'a@b.com' } })
    expect(next).toHaveBeenCalledOnce()
  })
})