import { describe, expect, it } from 'vitest'
import { parseAdminOrderListQuery } from './adminOrderListQuery.js'

describe('parseAdminOrderListQuery', () => {
  it('uses the default values when the query is empty', () => {
    // Given an empty query
    // When the query is parsed
    // Then the first page with 20 orders and no status is returned
    expect(parseAdminOrderListQuery({})).toEqual({ page: 1, pageSize: 20, status: undefined })
  })

  it('returns the page, the page size and the status', () => {
    // Given a query with all the values
    // When the query is parsed
    // Then the values are converted
    expect(parseAdminOrderListQuery({ page: '2', pageSize: '10', status: 'preparing' })).toEqual({
      page: 2,
      pageSize: 10,
      status: 'preparing',
    })
  })

  it('returns null when the status does not exist', () => {
    // Given an unknown status
    // When the query is parsed
    // Then null is returned
    expect(parseAdminOrderListQuery({ status: 'lost' })).toBeNull()
  })

  it('returns null when the status is sent twice', () => {
    // Given a status sent as an array
    // When the query is parsed
    // Then null is returned
    expect(parseAdminOrderListQuery({ status: ['pending', 'ready'] })).toBeNull()
  })

  it('returns null when the page size is bigger than 50', () => {
    // Given a page size that is too big
    // When the query is parsed
    // Then null is returned
    expect(parseAdminOrderListQuery({ pageSize: '51' })).toBeNull()
  })
})
