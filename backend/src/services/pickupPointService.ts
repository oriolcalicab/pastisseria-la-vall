import { prisma } from '../lib/prisma.js'

export const listPickupPoints = async () => {
  const points = await prisma.pickupPoint.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      address: true,
      city: true,
      latitude: true,
      longitude: true,
      openingHours: true,
    },
    orderBy: { name: 'asc' },
  })

  return points.map((point) => ({
    ...point,
    latitude: Number(point.latitude),
    longitude: Number(point.longitude),
  }))
}