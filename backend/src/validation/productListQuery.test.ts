import { describe, expect, it } from 'vitest'
import { parseProductListQuery } from './productListQuery.js'

describe('parseProductListQuery', () => {
  it('uses the default values when the query is empty', () => {
    // Given an empty query
    // When the query is parsed
    // Then the first page with 20 products and no search is returned
    expect(parseProductListQuery({})).toEqual({ page: 1, pageSize: 20, search: undefined })
  })

  it('returns the page, the page size and the trimmed search', () => {
    // Given a query with all the values
    // When the query is parsed
    // Then the values are converted and the search is trimmed
    expect(parseProductListQuery({ page: '2', pageSize: '10', search: '  croi  ' })).toEqual({
      page: 2,
      pageSize: 10,
      search: 'croi',
    })
  })

  it('ignores an empty search', () => {
    // Given a search with only spaces
    // When the query is parsed
    // Then there is no search
    expect(parseProductListQuery({ search: '   ' })).toMatchObject({ search: undefined })
  })

  it.each(['0', '-1', '1.5', 'abc'])('returns null when the page is %s', (page) => {
    // Given an invalid page
    // When the query is parsed
    // Then null is returned
    expect(parseProductListQuery({ page })).toBeNull()
  })

  it('returns null when the page size is bigger than 50', () => {
    // Given a page size that is too big
    // When the query is parsed
    // Then null is returned
    expect(parseProductListQuery({ pageSize: '51' })).toBeNull()
  })

  it('returns null when the search is sent twice', () => {
    // Given a search sent as an array
    // When the query is parsed
    // Then null is returned
    expect(parseProductListQuery({ search: ['a', 'b'] })).toBeNull()
  })
})