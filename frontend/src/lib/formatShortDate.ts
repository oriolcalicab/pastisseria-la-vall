const shortDateFormatter = new Intl.DateTimeFormat('ca-ES', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Europe/Madrid',
})

export const formatShortDate = (date: string): string => shortDateFormatter.format(new Date(date))
