import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loginAccount } from '../../features/auth/services/accountService'
import LoginPage from './LoginPage'

vi.mock('../../features/auth/services/accountService', () => ({
  loginAccount: vi.fn(),
}))

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<p>Pàgina d'inici</p>} />
        <Route path="/admin" element={<p>Tauler d'administració</p>} />
      </Routes>
    </MemoryRouter>,
  )

const fillAndSubmit = async (email: string, password: string) => {
  const user = userEvent.setup()

  if (email) await user.type(screen.getByLabelText('Correu'), email)
  if (password) await user.type(screen.getByLabelText('Contrasenya'), password)
  await user.click(screen.getByRole('button', { name: 'Entra' }))
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows a clear error when the credentials are wrong', async () => {
    // Given Firebase rejects the credentials
    vi.mocked(loginAccount).mockRejectedValue({
      code: 'auth/invalid-credential',
    })
    renderPage()

    // When the user submits the form
    await fillAndSubmit('oriol@test.com', 'wrong-password')

    // Then the user sees a clear error message
    expect(await screen.findByRole('alert')).toHaveTextContent('Correu o contrasenya incorrectes')
  })

  it('does not call the service when the form is empty', async () => {
    // Given an empty login form
    renderPage()

    // When the user submits it
    await fillAndSubmit('', '')

    // Then validation errors are shown and the service is not called
    expect(await screen.findByText('Escriu un correu vàlid')).toBeInTheDocument()
    expect(loginAccount).not.toHaveBeenCalled()
  })

  it('takes an admin straight to the admin panel', async () => {
    // Given an admin account
    vi.mocked(loginAccount).mockResolvedValue('admin')
    renderPage()

    // When the admin signs in
    await fillAndSubmit('admin@test.com', 'secret123')

    // Then the admin panel is shown
    expect(await screen.findByText("Tauler d'administració")).toBeInTheDocument()
  })

  it('takes a customer to the home page', async () => {
    // Given a customer account
    vi.mocked(loginAccount).mockResolvedValue('customer')
    renderPage()

    // When the customer signs in
    await fillAndSubmit('client@test.com', 'secret123')

    // Then the home page is shown
    expect(await screen.findByText("Pàgina d'inici")).toBeInTheDocument()
  })
})
