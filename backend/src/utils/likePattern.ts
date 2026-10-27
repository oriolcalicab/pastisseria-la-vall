export const escapeLikePattern = (value: string): string =>
  value.replace(/[\\%_]/g, (char) => `\\${char}`)

export const containsPattern = (value: string): string => `%${escapeLikePattern(value)}%`