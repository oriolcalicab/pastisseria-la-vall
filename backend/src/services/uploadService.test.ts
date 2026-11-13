import { afterEach, describe, expect, it, vi } from 'vitest'
import { signCloudinaryParams } from '../utils/cloudinarySignature.js'
import { createUploadSignature, PRODUCT_IMAGE_FOLDER } from './uploadService.js'

describe('createUploadSignature', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('signs the folder and the time without sending the secret', () => {
    // Given the Cloudinary keys of the backend
    vi.stubEnv('CLOUDINARY_CLOUD_NAME', 'demo-cloud')
    vi.stubEnv('CLOUDINARY_API_KEY', '123456')
    vi.stubEnv('CLOUDINARY_API_SECRET', 'top-secret')
    const now = new Date('2026-11-13T10:00:00Z')
    const timestamp = now.getTime() / 1000

    // When an upload is prepared
    const result = createUploadSignature(now)

    // Then the browser gets what it needs, but never the secret
    expect(result).toEqual({
      cloudName: 'demo-cloud',
      apiKey: '123456',
      folder: PRODUCT_IMAGE_FOLDER,
      timestamp,
      signature: signCloudinaryParams({ folder: PRODUCT_IMAGE_FOLDER, timestamp }, 'top-secret'),
    })
    expect(JSON.stringify(result)).not.toContain('top-secret')
  })
})
