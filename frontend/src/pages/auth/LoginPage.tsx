import { Link, useNavigate, useLocation } from 'react-router-dom'
import FormField from '../../components/FormField'
import { useLoginForm } from '../../features/auth/hooks/useLoginForm'
import { getLoginRedirectPath } from '../../features/auth/redirect'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { values, errors, submitError, isSubmitting, setValue, handleSubmit } = useLoginForm(
    (role) => navigate(getLoginRedirectPath(location.state, role), { replace: true }),
  )

  return (
    <main className="mx-auto max-w-md px-4 py-12 md:py-16">
      <p className="eyebrow">Hola de nou</p>
      <h1 className="page-title mt-2 font-display">Inicia la sessió</h1>

      <form onSubmit={handleSubmit} noValidate className="card mt-8 space-y-5">
        <FormField
          id="email"
          label="Correu"
          type="email"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          onChange={(value) => setValue('email', value)}
        />
        <FormField
          id="password"
          label="Contrasenya"
          type="password"
          autoComplete="current-password"
          value={values.password}
          error={errors.password}
          onChange={(value) => setValue('password', value)}
        />

        {submitError && (
          <p role="alert" className="text-sm text-red-700">
            {submitError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
          {isSubmitting ? 'Entrant...' : 'Entra'}
        </button>

        <p className="text-center text-sm">
          <Link to="/contrasenya-oblidada" className="link">
            Has oblidat la contrasenya?
          </Link>
        </p>
      </form>

      <p className="mt-6 text-center text-mocha">
        Encara no tens compte?{' '}
        <Link to="/registre" className="link font-medium">
          Registra't
        </Link>
      </p>
    </main>
  )
}

export default LoginPage
