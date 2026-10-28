import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Pagination from './Pagination'

describe('Pagination', () => {
  it('is hidden when there is only one page', () => {
    // Given a list with a single page
    // When the pagination is shown
    const { container } = render(<Pagination page={1} totalPages={1} onPageChange={vi.fn()} />)

    // Then nothing is rendered
    expect(container).toBeEmptyDOMElement()
  })

  it('disables previous on the first page', () => {
    // Given the first page of three
    // When the pagination is shown
    render(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />)

    // Then only next can be used
    expect(screen.getByRole('button', { name: '« Anterior' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Següent »' })).toBeEnabled()
  })

  it('disables next on the last page', () => {
    // Given the last page of three
    // When the pagination is shown
    render(<Pagination page={3} totalPages={3} onPageChange={vi.fn()} />)

    // Then only previous can be used
    expect(screen.getByRole('button', { name: '« Anterior' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Següent »' })).toBeDisabled()
  })

  it('asks for the previous page', async () => {
    // Given the second page of three
    const onPageChange = vi.fn()
    render(<Pagination page={2} totalPages={3} onPageChange={onPageChange} />)

    // When the user clicks previous
    await userEvent.setup().click(screen.getByRole('button', { name: '« Anterior' }))

    // Then the first page is requested
    expect(onPageChange).toHaveBeenCalledWith(1)
  })
})