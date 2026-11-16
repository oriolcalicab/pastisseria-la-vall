import type { RouteObject } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { routes } from './router'

vi.mock('./lib/firebase', () => ({ auth: {} }))

function collectPaths(list: RouteObject[], parent = ''): string[] {
  return list.flatMap((route) => {
    if (!route.path) return collectPaths(route.children ?? [], parent)
    const fullPath = route.path.startsWith('/') ? route.path : `${parent}/${route.path}`
    return [fullPath, ...collectPaths(route.children ?? [], fullPath)]
  })
}

describe('routes', () => {
  it('declares each path only once', () => {
    const paths = collectPaths(routes)
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('only has the shop layout and the admin area at the top level', () => {
    expect(routes).toHaveLength(2)
  })
})
