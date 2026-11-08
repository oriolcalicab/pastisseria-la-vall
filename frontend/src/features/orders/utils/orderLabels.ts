import type { DeliveryMethod } from '../../checkout/types/checkout'
import type { OrderStatus } from '../types/order'

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Pendent',
  preparing: 'En preparació',
  ready: 'Llesta',
  delivered: 'Entregada',
  cancelled: 'Cancel·lada',
}

export const deliveryMethodLabels: Record<DeliveryMethod, string> = {
  delivery: 'A domicili',
  pickup: 'Recollida',
}

const orderDateFormatter = new Intl.DateTimeFormat('ca-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Madrid',
})

export const formatOrderDate = (isoDate: string): string =>
  orderDateFormatter.format(new Date(isoDate))
