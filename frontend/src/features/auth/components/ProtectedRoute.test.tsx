import { render, screen } from '@testing-library/react'
import type { User } from 'firebase/auth'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../hooks/useAuth'
import ProtectedRoute from './ProtectedRoute'

vi.mock('../hooks/useAuth', () => ({ useAuth: vi.fn() }))

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<p>Pàgina de login</p>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/compte" element={<p>Pàgina privada</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('redirects to login when there is no session', () => {
    // Given a visitor without session
    vi.mocked(useAuth).mockReturnValue({ user: null, isLoading: false })

    // When the visitor opens a private page
    renderAt('/compte')

    // Then the visitor is sent to the login page
    expect(screen.getByText('Pàgina de login')).toBeInTheDocument()
    expect(screen.queryByText('Pàgina privada')).not.toBeInTheDocument()
  })

  it('shows the private page when there is a session', () => {
    // Given a logged user
    vi.mocked(useAuth).mockReturnValue({ user: { uid: 'u1' } as User, isLoading: false })

    // When the user opens a private page
    renderAt('/compte')

    // Then the private page is shown
    expect(screen.getByText('Pàgina privada')).toBeInTheDocument()
  })

  it('waits while the session is being checked', () => {
    // Given the session is still loading
    vi.mocked(useAuth).mockReturnValue({ user: null, isLoading: true })

    // When the visitor opens a private page
    renderAt('/compte')

    // Then there is no redirect yet
    expect(screen.getByText('Comprovant la sessió...')).toBeInTheDocument()
    expect(screen.queryByText('Pàgina de login')).not.toBeInTheDocument()
  })
})