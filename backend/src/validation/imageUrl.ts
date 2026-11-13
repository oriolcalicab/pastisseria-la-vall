const CLOUDINARY_PREFIX = 'https://res.cloudinary.com/'
const MAX_URL_LENGTH = 500

type ImageUrlResult = { ok: true; imageUrl: string | null } | { ok: false }

export const parseImageUrl = (value: unknown): ImageUrlResult => {
  if (value === undefined || value === null || value === '') return { ok: true, imageUrl: null }
  if (typeof value !== 'string') return { ok: false }

  const url = value.trim()

  if (!url.startsWith(CLOUDINARY_PREFIX) || url.length > MAX_URL_LENGTH) return { ok: false }

  return { ok: true, imageUrl: url }
}
