import type { CorsOptions } from 'cors'
import { describe, expect, it } from 'vitest'
import { createCorsOptions, parseAllowedOrigins } from './corsOptions.js'

const isAllowed = (options: CorsOptions, origin: string | undefined) =>
  new Promise<boolean>((resolve) => {
    if (typeof options.origin !== 'function') throw new Error('origin must be a function')

    options.origin(origin, (_error, allowed) => resolve(allowed === true))
  })

describe('parseAllowedOrigins', () => {
  it('reads the origins separated by commas', () => {
    expect(
      parseAllowedOrigins(' https://pastisseria-la-vall.vercel.app/ , http://localhost:5173 '),
    ).toEqual(['https://pastisseria-la-vall.vercel.app', 'http://localhost:5173'])
  })

  it('allows only the local frontend when the variable is empty', () => {
    expect(parseAllowedOrigins(undefined)).toEqual(['http://localhost:5173'])
    expect(parseAllowedOrigins(' , ')).toEqual(['http://localhost:5173'])
  })
})

describe('createCorsOptions', () => {
  const options = createCorsOptions(['https://pastisseria-la-vall.vercel.app'])

  it('allows the frontend of the list', async () => {
    expect(await isAllowed(options, 'https://pastisseria-la-vall.vercel.app')).toBe(true)
  })

  it('does not allow another website', async () => {
    expect(await isAllowed(options, 'https://evil.example')).toBe(false)
  })

  it('allows requests without origin, like curl or Render health checks', async () => {
    expect(await isAllowed(options, undefined)).toBe(true)
  })
})
