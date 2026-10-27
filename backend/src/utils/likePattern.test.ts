import { describe, expect, it } from 'vitest'
import { containsPattern, escapeLikePattern } from './likePattern.js'

describe('escapeLikePattern', () => {
  it('leaves normal text as it is', () => {
    // Given a text without special characters
    // When it is escaped
    // Then it does not change
    expect(escapeLikePattern('pastís')).toBe('pastís')
  })

  it('escapes the LIKE wildcards and the backslash', () => {
    // Given a text with %, _ and \
    // When it is escaped
    // Then each one has a backslash in front
    expect(escapeLikePattern('50%_a\\b')).toBe('50\\%\\_a\\\\b')
  })
})

describe('containsPattern', () => {
  it('wraps the escaped text with %', () => {
    // Given a search text
    // When the contains pattern is built
    // Then it matches the text in any position
    expect(containsPattern('50%')).toBe('%50\\%%')
  })
})