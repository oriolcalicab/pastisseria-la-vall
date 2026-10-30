const priceFormatter = new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR' })

export const formatPrice = (cents: number): string => priceFormatter.format(cents / 100)