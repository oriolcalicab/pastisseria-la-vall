import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchUploadSignature, uploadToCloudinary } from './imageUploadApi'

const signature = {
  cloudName: 'demo-cloud',
  apiKey: '123456',
  folder: 'pastisseria-la-vall/products',
  timestamp: 1794564000,
  signature: 'abc',
}

describe('imageUploadApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('asks the backend for a signature with the token', async () => {
    // Given a backend that signs the upload
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(signature)))
    vi.stubGlobal('fetch', fetchMock)

    // When the signature is requested
    const result = await fetchUploadSignature('token-123')

    // Then it is a POST with the token
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toContain('/api/admin/uploads/signature')
    expect(options).toEqual({ method: 'POST', headers: { Authorization: 'Bearer token-123' } })
    expect(result).toEqual(signature)
  })

  it('uploads the file to the cloud of the signature and returns its address', async () => {
    // Given Cloudinary that saves the image
    const imageUrl = 'https://res.cloudinary.com/demo-cloud/image/upload/v1/pastis.jpg'
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ secure_url: imageUrl })))
    vi.stubGlobal('fetch', fetchMock)
    const file = new File(['image'], 'pastis.jpg', { type: 'image/jpeg' })

    // When the image is uploaded
    const result = await uploadToCloudinary(file, signature)

    // Then it goes to that cloud with the signed fields and the address comes back
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.cloudinary.com/v1_1/demo-cloud/image/upload')
    const body = options.body as FormData
    expect(body.get('file')).toBe(file)
    expect(body.get('signature')).toBe('abc')
    expect(body.get('folder')).toBe('pastisseria-la-vall/products')
    expect(result).toBe(imageUrl)
  })
})
