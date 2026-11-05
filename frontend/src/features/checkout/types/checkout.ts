export type DeliveryMethod = 'delivery' | 'pickup'

export type ShippingAddress = {
  address: string
  city: string
  postalCode: string
}

export type ShippingAddressErrors = Partial<Record<keyof ShippingAddress, string>>