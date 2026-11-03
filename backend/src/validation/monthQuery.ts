const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/

export const parseMonthQuery = (value: unknown, defaultMonth: string): string | null => {
  if (value === undefined) return defaultMonth

  return typeof value === 'string' && MONTH_PATTERN.test(value) ? value : null
}