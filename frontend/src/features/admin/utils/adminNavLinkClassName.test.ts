import { describe, expect, it } from 'vitest'
import { adminNavLinkClassName } from './adminNavLinkClassName'

describe('adminNavLinkClassName', () => {
  it('fills the link of the current page in chocolate', () => {
    // Given the link of the current page
    // When its classes are built
    const className = adminNavLinkClassName({ isActive: true })

    // Then it is filled and has no outline
    expect(className).toContain('bg-cocoa')
    expect(className).not.toContain('ring-1')
  })

  it('outlines the other links on a phone', () => {
    // Given the link of another page
    // When its classes are built
    const className = adminNavLinkClassName({ isActive: false })

    // Then it is outlined and not filled
    expect(className).toContain('ring-1')
    expect(className).not.toContain('bg-cocoa')
  })
})
