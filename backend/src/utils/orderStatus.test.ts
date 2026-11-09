import { describe, expect, it } from 'vitest'
import type { OrderStatus } from '../generated/prisma/enums.js'
import { canChangeStatus } from './orderStatus.js'

describe('canChangeStatus', () => {
  it.each<[OrderStatus, OrderStatus]>([
    ['pending', 'preparing'],
    ['pending', 'cancelled'],
    ['preparing', 'ready'],
    ['preparing', 'cancelled'],
    ['ready', 'delivered'],
    ['ready', 'cancelled'],
  ])('lets an order go from %s to %s', (from, to) => {
    // Given an order in the first status
    // When it changes to the second status
    // Then the change is valid
    expect(canChangeStatus(from, to)).toBe(true)
  })

  it.each<[OrderStatus, OrderStatus]>([
    ['pending', 'ready'],
    ['pending', 'delivered'],
    ['pending', 'pending'],
    ['ready', 'pending'],
    ['delivered', 'cancelled'],
    ['cancelled', 'pending'],
  ])('does not let an order go from %s to %s', (from, to) => {
    // Given an order in the first status
    // When it changes to the second status
    // Then the change is not valid
    expect(canChangeStatus(from, to)).toBe(false)
  })
})
