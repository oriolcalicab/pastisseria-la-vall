import type { ShippingAddress, ShippingAddressErrors } from '../types/checkout'

const MIN_ADDRESS_LENGTH = 5
const MAX_ADDRESS_LENGTH = 200
const MIN_CITY_LENGTH = 2
const MAX_CITY_LENGTH = 100
const BARCELONA_POSTAL_CODE = /^080\d{2}$/

type ShippingAddressResult =
  | { ok: true; address: ShippingAddress }
  | { ok: false; errors: ShippingAddressErrors }

const isLengthBetween = (value: string, min: number, max: number) =>
  value.length >= min && value.length <= max

export const validateShippingAddress = (values: ShippingAddress): ShippingAddressResult => {
  const address = values.address.trim()
  const city = values.city.trim()
  const postalCode = values.postalCode.trim()
  const errors: ShippingAddressErrors = {}

  if (!isLengthBetween(address, MIN_ADDRESS_LENGTH, MAX_ADDRESS_LENGTH)) {
    errors.address = 'Escriu el carrer, el número i, si cal, el pis'
  }

  if (!isLengthBetween(city, MIN_CITY_LENGTH, MAX_CITY_LENGTH)) {
    errors.city = 'Escriu la població'
  }

  if (!BARCELONA_POSTAL_CODE.test(postalCode)) {
    errors.postalCode = 'El codi postal ha de ser de Barcelona (080xx)'
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors }

  return { ok: true, address: { address, city, postalCode } }
}