import type { RegisterBody } from '../types/auth.js'

const MIN_NAME_LENGTH = 2

export const parseRegisterBody = (body: unknown): RegisterBody | null => {
  if (typeof body !== 'object' || body === null) return null

  const { name } = body as { name?: unknown }

  if (typeof name !== 'string') return null

  const trimmedName = name.trim()

  if (trimmedName.length < MIN_NAME_LENGTH) return null

  return { name: trimmedName }
}
