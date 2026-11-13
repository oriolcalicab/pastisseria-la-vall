const BARCELONA = 'barcelona'

const normalize = (value: string) =>
  value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

export const isBarcelonaCity = (city: string): boolean => normalize(city) === BARCELONA
