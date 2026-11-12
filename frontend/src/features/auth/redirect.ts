import type { UserRole } from './services/authApi'

const DEFAULT_PATH = '/'
const ADMIN_PATH = '/admin'

type LocationState = {
  from?: { pathname?: unknown; search?: unknown }
}

export const getRedirectPath = (state: unknown): string => {
  if (typeof state !== 'object' || state === null) return DEFAULT_PATH

  const from = (state as LocationState).from
  const pathname = from?.pathname

  if (typeof pathname !== 'string') return DEFAULT_PATH
  if (!pathname.startsWith('/') || pathname.startsWith('//')) return DEFAULT_PATH

  const search = typeof from?.search === 'string' ? from.search : ''

  return `${pathname}${search}`
}

export const getLoginRedirectPath = (state: unknown, role: UserRole): string => {
  const path = getRedirectPath(state)

  if (path !== DEFAULT_PATH) return path

  return role === 'admin' ? ADMIN_PATH : DEFAULT_PATH
}
