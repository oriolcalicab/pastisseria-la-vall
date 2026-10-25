import type { NextFunction, Request, Response } from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { findUserByFirebaseUid } from '../services/userService.js'
import { loadUser } from './loadUser.js'

vi.mock('../services/userService.js', () => ({ findUserByFirebaseUid: vi.fn() }))

const createResponse = (locals: object) => {
  const res = { locals, status: vi.fn(), json: vi.fn() }
  res.status.mockReturnValue(res)
  return res
}

const callMiddleware = async (locals: object) => {
  const res = createResponse(locals)
  const next = vi.fn()

  await loadUser({} as Request, res as unknown as Response, next as NextFunction)

  return { res, next }
}

describe('loadUser', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('responds 401 when the token was not verified', async () => {
    // Given a request that did not pass token verification
    // When the middleware runs
    const { res, next } = await callMiddleware({})

    // Then the request is rejected with 401
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('responds 401 when the user is not registered in the database', async () => {
    // Given a valid Firebase user without row in users
    vi.mocked(findUserByFirebaseUid).mockResolvedValue(null)

    // When the middleware runs
    const { res, next } = await callMiddleware({ firebaseUser: { uid: 'u1', email: 'a@b.com' } })

    // Then the request is rejected with 401
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('stores the user and continues when the user exists', async () => {
    // Given a valid Firebase user with a row in users
    const user = { id: 1, role: 'customer' }
    vi.mocked(findUserByFirebaseUid).mockResolvedValue(user as never)
    const locals = { firebaseUser: { uid: 'u1', email: 'a@b.com' } }

    // When the middleware runs
    const { res, next } = await callMiddleware(locals)

    // Then the user is available in res.locals and the request continues
    expect(res.locals).toMatchObject({ user })
    expect(next).toHaveBeenCalledOnce()
  })
})