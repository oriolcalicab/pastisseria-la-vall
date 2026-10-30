import { describe, expect, it } from 'vitest'
import noProductImage from '../../../assets/no-product.svg'
import { getProductImageUrl } from './productImage'

describe('getProductImageUrl', () => {
  it('returns the image of the product', () => {
    // Given a product with an image
    // When the image is requested
    // Then the same image is returned
    expect(getProductImageUrl('https://example.com/pastis.jpg')).toBe(
      'https://example.com/pastis.jpg',
    )
  })

  it.each([null, ''])('returns the placeholder when the image is %j', (imageUrl) => {
    // Given a product without image
    // When the image is requested
    // Then the placeholder is returned
    expect(getProductImageUrl(imageUrl)).toBe(noProductImage)
  })
})