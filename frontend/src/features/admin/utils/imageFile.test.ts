import { describe, expect, it } from 'vitest'
import { validateImageFile } from './imageFile'

const fileOf = (type: string, size = 1000) => new File([new Uint8Array(size)], 'pastis', { type })

describe('validateImageFile', () => {
  it('accepts a JPG, a PNG and a WebP image', () => {
    expect(validateImageFile(fileOf('image/jpeg'))).toBeNull()
    expect(validateImageFile(fileOf('image/png'))).toBeNull()
    expect(validateImageFile(fileOf('image/webp'))).toBeNull()
  })

  it('rejects a file that is not an image', () => {
    expect(validateImageFile(fileOf('application/pdf'))).toBe('Tria una imatge JPG, PNG o WebP')
  })

  it('rejects an image bigger than 5 MB', () => {
    expect(validateImageFile(fileOf('image/jpeg', 5 * 1024 * 1024 + 1))).toBe(
      'La imatge pot ocupar fins a 5 MB',
    )
  })
})
