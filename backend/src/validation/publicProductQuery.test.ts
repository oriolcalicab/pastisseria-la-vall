import { describe, expect, it } from 'vitest'
import { parsePublicProductQuery } from './publicProductQuery.js'

describe('parsePublicProductQuery', () => {
  it('uses the default values when the query is empty', () => {
    // Given an empty query
    // When the query is parsed
    // Then the first page of all the categories is returned
    expect(parsePublicProductQuery({})).toEqual({ page: 1, pageSize: 20, category: undefined })
  })

  it('returns the page, the page size and the category', () => {
    // Given a query with all the values
    const query = { page: '2', pageSize: '12', category: 'pastissos' }

    // When the query is parsed
    // Then the values are converted
    expect(parsePublicProductQuery(query)).toEqual({ page: 2, pageSize: 12, category: 'pastissos' })
  })

  it('ignores the search', () => {
    // Given a query with a search
    // When the query is parsed
    // Then the search is not returned
    expect(parsePublicProductQuery({ search: 'xoco' })).toEqual({
      page: 1,
      pageSize: 20,
      category: undefined,
    })
  })

  it.each([
    ['with capital letters', 'Pastissos'],
    ['with spaces', 'pa stissos'],
    ['with a path', '../admin'],
    ['empty', ''],
    ['sent twice', ['pastissos', 'cupcakes']],
  ])('returns null when the category is %s', (_case, category) => {
    // Given an invalid category
    // When the query is parsed
    // Then null is returned
    expect(parsePublicProductQuery({ category })).toBeNull()
  })

  it('returns null when the page is not valid', () => {
    // Given an invalid page
    // When the query is parsed
    // Then null is returned
    expect(parsePublicProductQuery({ page: '0' })).toBeNull()
  })
})