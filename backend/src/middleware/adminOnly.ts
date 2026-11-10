import { requireAdmin } from './requireAdmin.js'
import { requireAuth } from './requireAuth.js'

export const adminOnly = [...requireAuth, requireAdmin]
