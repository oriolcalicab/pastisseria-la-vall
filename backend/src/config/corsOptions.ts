import type { CorsOptions } from 'cors'

const DEFAULT_ORIGINS = ['http://localhost:5173']

export const parseAllowedOrigins = (value: string | undefined): string[] => {
  const origins = (value ?? '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter((origin) => origin !== '')

  return origins.length > 0 ? origins : DEFAULT_ORIGINS
}

export const createCorsOptions = (allowedOrigins: string[]): CorsOptions => ({
  origin: (origin, callback) => {
    callback(null, !origin || allowedOrigins.includes(origin))
  },
})
