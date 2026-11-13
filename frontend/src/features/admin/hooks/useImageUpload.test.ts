import { act, renderHook } from '@testing-library/react'
import type { User } from 'firebase/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchUploadSignature, uploadToCloudinary } from '../services/imageUploadApi'
import { useImageUpload } from './useImageUpload'

vi.mock('../../auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../services/imageUploadApi', () => ({
  fetchUploadSignature: vi.fn(),
  uploadToCloudinary: vi.fn(),
}))

const user = { getIdToken: vi.fn() } as unknown as User
const image = new File(['image'], 'pastis.jpg', { type: 'image/jpeg' })

describe('useImageUpload', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(user.getIdToken).mockResolvedValue('token-123')
    vi.mocked(useAuth).mockReturnValue({ user, isLoading: false })
  })

  it('gives the address of the uploaded image', async () => {
    // Given a backend that signs and Cloudinary that saves the image
    const onUploaded = vi.fn()
    vi.mocked(fetchUploadSignature).mockResolvedValue({ signature: 'abc' } as never)
    vi.mocked(uploadToCloudinary).mockResolvedValue('https://res.cloudinary.com/demo/pastis.jpg')
    const { result } = renderHook(() => useImageUpload(onUploaded))

    // When the admin uploads an image
    await act(() => result.current.upload(image))

    // Then the form gets its address
    expect(fetchUploadSignature).toHaveBeenCalledWith('token-123')
    expect(onUploaded).toHaveBeenCalledWith('https://res.cloudinary.com/demo/pastis.jpg')
    expect(result.current.error).toBe('')
  })

  it('does not upload a file that is not an image', async () => {
    // Given the hook
    const { result } = renderHook(() => useImageUpload(vi.fn()))

    // When the admin picks a PDF
    await act(() =>
      result.current.upload(new File(['pdf'], 'menu.pdf', { type: 'application/pdf' })),
    )

    // Then the error is shown and nothing is uploaded
    expect(result.current.error).toBe('Tria una imatge JPG, PNG o WebP')
    expect(fetchUploadSignature).not.toHaveBeenCalled()
  })

  it('shows an error when the upload fails', async () => {
    // Given Cloudinary that fails
    const onUploaded = vi.fn()
    vi.mocked(fetchUploadSignature).mockResolvedValue({ signature: 'abc' } as never)
    vi.mocked(uploadToCloudinary).mockRejectedValue(new Error('down'))
    const { result } = renderHook(() => useImageUpload(onUploaded))

    // When the admin uploads an image
    await act(() => result.current.upload(image))

    // Then the error is shown and the form keeps its image
    expect(result.current.error).toBe("No s'ha pogut pujar la imatge. Torna-ho a provar.")
    expect(onUploaded).not.toHaveBeenCalled()
  })
})
