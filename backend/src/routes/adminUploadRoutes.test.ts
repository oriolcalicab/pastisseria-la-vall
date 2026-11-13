import express from 'express'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { adminOnly } from '../middleware/adminOnly.js'
import { verifyFirebaseToken } from '../services/tokenService.js'
import { createUploadSignature } from '../services/uploadService.js'
import { findUserByFirebaseUid } from '../services/userService.js'
import { startTestServer } from '../test/startTestServer.js'
import type { TestServer } from '../test/startTestServer.js'
import adminUploadRouter from './adminUploadRoutes.js'

vi.mock('../services/tokenService.js', () => ({ verifyFirebaseToken: vi.fn() }))
vi.mock('../services/userService.js', () => ({ findUserByFirebaseUid: vi.fn() }))
vi.mock('../services/uploadService.js', () => ({ createUploadSignature: vi.fn() }))

let server: TestServer

const loginAs = (role: 'customer' | 'admin') => {
  vi.mocked(verifyFirebaseToken).mockResolvedValue({ uid: 'u1', email: 'a@b.com' })
  vi.mocked(findUserByFirebaseUid).mockResolvedValue({ id: 1, role } as never)
}

const askSignature = () =>
  fetch(`${server.baseUrl}/api/admin/uploads/signature`, {
    method: 'POST',
    headers: { Authorization: 'Bearer token' },
  })

describe('admin upload routes', () => {
  beforeAll(async () => {
    const app = express()
    app.use('/api/admin/uploads', adminOnly, adminUploadRouter)
    server = await startTestServer(app)
  })

  afterAll(() => {
    server.close()
  })

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('gives an admin the signature to upload an image', async () => {
    // Given a logged admin
    loginAs('admin')
    const signature = { cloudName: 'demo-cloud', signature: 'abc' }
    vi.mocked(createUploadSignature).mockReturnValue(signature as never)

    // When the admin asks to upload an image
    const response = await askSignature()

    // Then the signature is returned
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(signature)
  })

  it('responds 403 when a customer asks for a signature', async () => {
    // Given a logged customer
    loginAs('customer')

    // When the customer asks to upload an image
    const response = await askSignature()

    // Then the request is rejected and nothing is signed
    expect(response.status).toBe(403)
    expect(createUploadSignature).not.toHaveBeenCalled()
  })
})
