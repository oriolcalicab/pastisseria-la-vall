import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('shows the seal and links to the shop pages', () => {
    // Given the footer
    // When it is shown
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    )

    // Then it has the seal and the shop links
    expect(screen.getByRole('img', { name: 'Pastisseria La Vall' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Productes' })).toHaveAttribute('href', '/productes')
    expect(screen.getByRole('link', { name: 'Les meves comandes' })).toHaveAttribute(
      'href',
      '/comandes',
    )
  })
})
