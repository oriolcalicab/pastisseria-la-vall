import { describe, expect, it } from 'vitest'
import { navLinkClassName } from './navLinkClassName'

describe('navLinkClassName', () => {
  it('marks the current page in caramel', () => {
    // Given the link of the current page
    // When its classes are built
    const className = navLinkClassName({ isActive: true })

    // Then it is caramel
    expect(className).toContain('text-caramel')
  })

  it('leaves the other links in the normal colour', () => {
    // Given the link of another page
    // When its classes are built
    const className = navLinkClassName({ isActive: false })

    // Then it is not caramel
    expect(className).not.toContain('font-medium')
  })
})
