import type { NextFunction, Request, Response } from 'express'
import { describe, expect, it, vi } from 'vitest'
import { requireAdmin } from './requireAdmin.js'

const createResponse = (locals: object) => {
  const res = { locals, status: vi.fn(), json: vi.fn() }
  res.status.mockReturnValue(res)
  return res
}

const callMiddleware = (locals: object) => {
  const res = createResponse(locals)
  const next = vi.fn()

  requireAdmin({} as Request, res as unknown as Response, next as NextFunction)

  return { res, next }
}

describe('requireAdmin', () => {
  it('responds 401 when there is no user', () => {
    // Given a request without a loaded user
    // When the middleware runs
    const { res, next } = callMiddleware({})

    // Then the request is rejected with 401
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('responds 403 when the user is a customer', () => {
    // Given a logged customer
    // When the middleware runs
    const { res, next } = callMiddleware({ user: { id: 1, role: 'customer' } })

    // Then the request is rejected with 403
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ error: 'Accés denegat' })
    expect(next).not.toHaveBeenCalled()
  })

  it('continues when the user is an admin', () => {
    // Given a logged admin
    // When the middleware runs
    const { res, next } = callMiddleware({ user: { id: 2, role: 'admin' } })

    // Then the request continues
    expect(next).toHaveBeenCalledOnce()
    expect(res.status).not.toHaveBeenCalled()
  })
})