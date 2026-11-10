import type { User } from '../generated/prisma/client.js'
import type { VerifiedUser } from './auth.js'

declare global {
  namespace Express {
    interface Locals {
      firebaseUser?: VerifiedUser
      user?: User
    }
  }
}
