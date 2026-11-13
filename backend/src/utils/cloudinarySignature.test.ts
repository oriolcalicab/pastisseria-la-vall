import { describe, expect, it } from 'vitest'
import { signCloudinaryParams } from './cloudinarySignature.js'

describe('signCloudinaryParams', () => {
  it('signs the sorted params with the secret like the Cloudinary docs', () => {
    const params = {
      timestamp: 1315060510,
      public_id: 'sample_image',
      eager: 'w_400,h_300,c_pad|w_260,h_200,c_crop',
    }

    expect(signCloudinaryParams(params, 'abcd')).toBe('bfd09f95f331f558cbd1320e67aa8d488770583e')
  })
})
