import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AdminLayout from './AdminLayout'

vi.mock('../../auth/components/LogoutButton', () => ({
  default: () => <button type="button">Tanca la sessió</button>,
}))

describe('AdminLayout', () => {
  it('only links to the admin pages that exist', () => {
    // Given the admin panel
    // When it is shown
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminLayout />
      </MemoryRouter>,
    )

    // Then the menu has the dashboard, the orders, the calendar and the products
    const menu = screen.getByRole('navigation', { name: "Menú d'administració" })
    const links = within(menu).getAllByRole('link')

    expect(links.map((link) => link.textContent)).toEqual([
      'Tauler',
      'Comandes',
      'Calendari',
      'Productes',
    ])
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/admin',
      '/admin/comandes',
      '/admin/calendari',
      '/admin/productes',
    ])
  })
})
