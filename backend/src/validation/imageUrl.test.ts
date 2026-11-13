import { describe, expect, it } from 'vitest'
import { parseImageUrl } from './imageUrl.js'

describe('parseImageUrl', () => {
  it.each([undefined, null, ''])('saves no image for %s', (value) => {
    expect(parseImageUrl(value)).toEqual({ ok: true, imageUrl: null })
  })

  it('accepts an image of Cloudinary', () => {
    const url = 'https://res.cloudinary.com/demo-cloud/image/upload/v1/pastis.jpg'

    expect(parseImageUrl(` ${url} `)).toEqual({ ok: true, imageUrl: url })
  })

  it.each(['http://res.cloudinary.com/demo/pastis.jpg', 'https://evil.example/pastis.jpg', 42])(
    'rejects %s',
    (value) => {
      expect(parseImageUrl(value)).toEqual({ ok: false })
    },
  )
})
