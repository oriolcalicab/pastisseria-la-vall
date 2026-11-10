type Address = {
  address: string
  postalCode: string
  city: string
}

export const getMapSearchUrl = ({ address, postalCode, city }: Address): string => {
  const query = encodeURIComponent(`${address}, ${postalCode} ${city}`)

  return `https://www.google.com/maps/search/?api=1&query=${query}`
}
