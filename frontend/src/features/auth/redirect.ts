const DEFAULT_PATH = '/'

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