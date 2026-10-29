const ID_PATTERN = /^[1-9]\d*$/
const MAX_ID = 2_147_483_647

export const parseIdParam = (value: unknown): number | null => {
  if (typeof value !== 'string' || !ID_PATTERN.test(value)) return null

  const id = Number(value)

  return id <= MAX_ID ? id : null
}