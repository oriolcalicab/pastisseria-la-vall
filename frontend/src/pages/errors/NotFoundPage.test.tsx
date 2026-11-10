import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import NotFoundPage from './NotFoundPage'

describe('NotFoundPage', () => {
  it('shows the message and a link to the products', () => {
    // Given a page that does not exist
    // When the not found page is shown
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    )

    // Then the user can go back to the products
    expect(screen.getByRole('heading', { name: 'Pàgina no trobada' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Veure els productes' })).toHaveAttribute(
      'href',
      '/productes',
    )
  })
})
