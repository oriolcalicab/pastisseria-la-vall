import { beforeEach, describe, expect, it, vi } from 'vitest'
import { prisma } from '../lib/prisma.js'
import { listPickupPoints } from './pickupPointService.js'

vi.mock('../lib/prisma.js', () => ({
  prisma: { pickupPoint: { findMany: vi.fn() } },
}))

describe('listPickupPoints', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(prisma.pickupPoint.findMany).mockResolvedValue([])
  })

  it('only asks for the active pickup points', async () => {
    // Given some pickup points
    // When they are listed
    await listPickupPoints()

    // Then only the active ones are requested, in order of name
    expect(prisma.pickupPoint.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isActive: true }, orderBy: { name: 'asc' } }),
    )
  })

  it('returns the coordinates as numbers', async () => {
    // Given a pickup point with decimal coordinates
    vi.mocked(prisma.pickupPoint.findMany).mockResolvedValue([
      {
        id: 2,
        name: 'La Vall · Eixample',
        address: 'Carrer de Girona, 84',
        city: 'Barcelona',
        latitude: '41.3965',
        longitude: '2.1675',
        openingHours: 'De dt. a ds., de 9 a 19 h',
      },
    ] as never)

    // When the pickup points are listed
    const [point] = await listPickupPoints()

    // Then the coordinates are numbers that the map can use
    expect(point).toMatchObject({ latitude: 41.3965, longitude: 2.1675 })
  })
})
