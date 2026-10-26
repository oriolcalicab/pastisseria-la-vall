import { Link, useNavigate, useLocation } from 'react-router-dom'
import FormField from '../../components/FormField'
import { useLoginForm } from '../../features/auth/hooks/useLoginForm'
import { getRedirectPath } from '../../features/auth/redirect'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectPath = getRedirectPath(location.state)
  const { values, errors, submitError, isSubmitting, setValue, handleSubmit } =
    useLoginForm(() => navigate(redirectPath, { replace: true }))

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-bold">Inicia la sessió</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
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
          <p role="alert" className="text-sm text-red-600">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? 'Entrant...' : 'Entra'}
        </button>
      </form>

      <p className="mt-4 text-sm">
        <Link to="/contrasenya-oblidada" className="underline">
          Has oblidat la contrasenya?
        </Link>
      </p>

      <p className="mt-4 text-sm">
        Encara no tens compte?{' '}
        <Link to="/registre" className="underline">
          Registra't
        </Link>
      </p>
    </main>
  )
}

export default LoginPage
