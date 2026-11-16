import { DeliveryMethod } from '../generated/prisma/enums.js'

const deliveryMethods: string[] = Object.values(DeliveryMethod)

export const isDeliveryMethod = (value: unknown): value is DeliveryMethod =>
  typeof value === 'string' && deliveryMethods.includes(value)
