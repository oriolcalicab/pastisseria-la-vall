export const parsePositiveInt = (value: unknown, defaultValue: number): number | null => {
  if (value === undefined) return defaultValue
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return null

  const number = Number(value)

  return number >= 1 ? number : null
}
