import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { registerAccount } from '../../features/auth/services/accountService'
import { EmailAlreadyInUseError } from '../../features/auth/services/authService'
import RegisterPage from './RegisterPage'

vi.mock('../../lib/firebase', () => ({ auth: {} }))
vi.mock('../../features/auth/services/accountService', () => ({ registerAccount: vi.fn() }))

const renderPage = () =>
  render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>,
  )

const fillAndSubmit = async (name: string, email: string, password: string) => {
  const user = userEvent.setup()

  await user.type(screen.getByLabelText('Nom'), name)
  await user.type(screen.getByLabelText('Correu'), email)
  await user.type(screen.getByLabelText('Contrasenya'), password)
  await user.click(screen.getByRole('button', { name: "Registra'm" }))
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows a clear error when the email already exists', async () => {
    // Given an email that is already registered
    vi.mocked(registerAccount).mockRejectedValue(new EmailAlreadyInUseError())
    renderPage()

    // When the user submits the form
    await fillAndSubmit('Oriol', 'oriol@test.com', '12345678')

    // Then the user sees that the email is already registered
    expect(await screen.findByRole('alert')).toHaveTextContent('Aquest correu ja està registrat')
  })

  it('shows validation errors and does not call the service with invalid data', async () => {
    // Given a form with a short password
    renderPage()

    // When the user submits the form
    await fillAndSubmit('Oriol', 'oriol@test.com', '123')

    // Then the password error is shown and no account is created
    expect(await screen.findByText(/almenys 8 caràcters/)).toBeInTheDocument()
    expect(registerAccount).not.toHaveBeenCalled()
  })

  it('shows a confirmation when the account is created', async () => {
    // Given a service that creates the account correctly
    vi.mocked(registerAccount).mockResolvedValue(undefined)
    renderPage()

    // When the user submits valid data
    await fillAndSubmit('Oriol', 'oriol@test.com', '12345678')

    // Then the confirmation is shown
    expect(await screen.findByRole('heading', { name: 'Compte creat!' })).toBeInTheDocument()
  })
})