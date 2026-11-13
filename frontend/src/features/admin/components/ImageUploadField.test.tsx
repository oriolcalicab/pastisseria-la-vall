import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useImageUpload } from '../hooks/useImageUpload'
import ImageUploadField from './ImageUploadField'

vi.mock('../hooks/useImageUpload', () => ({ useImageUpload: vi.fn() }))

const upload = vi.fn()

describe('ImageUploadField', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(useImageUpload).mockReturnValue({ upload, isUploading: false, error: '' })
  })

  it('uploads the image the admin picks', async () => {
    // Given a product without image
    render(<ImageUploadField imageUrl="" onChange={vi.fn()} />)
    const image = new File(['image'], 'pastis.jpg', { type: 'image/jpeg' })

    // When the admin picks a photo
    await userEvent.upload(screen.getByLabelText(/Imatge del producte/), image)

    // Then it is uploaded
    expect(upload).toHaveBeenCalledWith(image)
  })

  it('shows the image and lets the admin remove it', async () => {
    // Given a product with an image
    const onChange = vi.fn()
    render(
      <ImageUploadField
        imageUrl="https://res.cloudinary.com/demo/pastis.jpg"
        onChange={onChange}
      />,
    )

    // When the admin removes it
    expect(screen.getByAltText('Vista prèvia de la imatge del producte')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Treu la imatge' }))

    // Then the product has no image
    expect(onChange).toHaveBeenCalledWith('')
  })
})
