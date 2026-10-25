import { Prisma } from '../generated/prisma/client.js'
import type { User } from '../generated/prisma/client.js'
import { prisma } from '../lib/prisma.js'

type NewCustomer = {
  firebaseUid: string
  email: string
  name: string
}

type RegisterResult = {
  user: User
  created: boolean
}

export const findUserByFirebaseUid = (firebaseUid: string) =>
  prisma.user.findUnique({ where: { firebaseUid } })

const createCustomer = (data: NewCustomer) =>
  prisma.user.create({ data: { ...data, role: 'customer' } })

export const registerCustomer = async (data: NewCustomer): Promise<RegisterResult> => {
  const existingUser = await findUserByFirebaseUid(data.firebaseUid)

  if (existingUser) {
    return { user: existingUser, created: false }
  }

  const user = await createCustomer(data)

  return { user, created: true }
}

export const isUniqueConstraintError = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'

export const toPublicUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
})