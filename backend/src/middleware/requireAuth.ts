import { loadUser } from './loadUser.js'
import { verifyToken } from './verifyToken.js'

export const requireAuth = [verifyToken, loadUser]