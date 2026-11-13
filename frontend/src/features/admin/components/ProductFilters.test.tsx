import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCategories } from '../hooks/useCategories'
import ProductFilters from './ProductFilters'

vi.mock('../hooks/useCategories', () => ({ useCategories: vi.fn() }))

describe('ProductFilters', () => {
  beforeEach(() => {
    vi.mocked(useCategories).mockReturnValue({
      status: 'success',
      categories: [
        { id: 1, name: 'Pastissos', slug: 'pastissos' },
        { id: 2, name: 'Cupcakes', slug: 'cupcakes' },
      ],
    })
  })

  it('sends the category and the status the admin picks', async () => {
    // Given the filters without any choice
    const onCategoryChange = vi.fn()
    const onStatusChange = vi.fn()
    render(
      <ProductFilters
        categoryId=""
        status=""
        onCategoryChange={onCategoryChange}
        onStatusChange={onStatusChange}
      />,
    )

    // When the admin picks the cupcakes that are not active
    await userEvent.selectOptions(screen.getByLabelText('Categoria'), 'Cupcakes')
    await userEvent.selectOptions(screen.getByLabelText('Estat'), 'Inactius')

    // Then both choices are sent
    expect(onCategoryChange).toHaveBeenCalledWith('2')
    expect(onStatusChange).toHaveBeenCalledWith('inactive')
  })
})
