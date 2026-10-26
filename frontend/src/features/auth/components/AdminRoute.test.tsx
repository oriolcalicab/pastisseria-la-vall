import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCurrentUser } from '../hooks/useCurrentUser'
import type { CurrentUser } from '../services/authApi'
import AdminRoute from './AdminRoute'

vi.mock('../hooks/useCurrentUser', () => ({ useCurrentUser: vi.fn() }))

const customer: CurrentUser = { id: 1, name: 'Anna', email: 'anna@test.com', role: 'customer' }
const admin: CurrentUser = { id: 2, name: 'Oriol', email: 'oriol@test.com', role: 'admin' }

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<p>Pàgina de login</p>} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<p>Pàgina d'admin</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )

describe('AdminRoute', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('redirects to login when there is no session', () => {
    // Given a visitor without session
    vi.mocked(useCurrentUser).mockReturnValue({ currentUser: null, isLoading: false })

    // When the visitor opens the admin page
    renderAt('/admin')

    // Then the visitor is sent to the login page
    expect(screen.getByText('Pàgina de login')).toBeInTheDocument()
    expect(screen.queryByText("Pàgina d'admin")).not.toBeInTheDocument()
  })

  it('shows access denied to a customer', () => {
    // Given a logged customer
    vi.mocked(useCurrentUser).mockReturnValue({ currentUser: customer, isLoading: false })

    // When the customer opens the admin page
    renderAt('/admin')

    // Then the customer sees "Accés denegat"
    expect(screen.getByText('Accés denegat')).toBeInTheDocument()
    expect(screen.queryByText("Pàgina d'admin")).not.toBeInTheDocument()
  })

  it('shows the admin page to an admin', () => {
    // Given a logged admin
    vi.mocked(useCurrentUser).mockReturnValue({ currentUser: admin, isLoading: false })

    // When the admin opens the admin page
    renderAt('/admin')

    // Then the admin page is shown
    expect(screen.getByText("Pàgina d'admin")).toBeInTheDocument()
  })

  it('waits while the role is being checked', () => {
    // Given the role is still loading
    vi.mocked(useCurrentUser).mockReturnValue({ currentUser: null, isLoading: true })

    // When someone opens the admin page
    renderAt('/admin')

    // Then there is no redirect yet
    expect(screen.getByText('Comprovant la sessió...')).toBeInTheDocument()
    expect(screen.queryByText('Pàgina de login')).not.toBeInTheDocument()
  })
})