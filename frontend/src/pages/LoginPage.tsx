import { Link, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import { useLoginForm } from '../features/auth/hooks/useLoginForm'

const LoginPage = () => {
  const navigate = useNavigate()
  const { values, errors, submitError, isSubmitting, setValue, handleSubmit } = useLoginForm(() =>
    navigate('/'),
  )

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
        Encara no tens compte?{' '}
        <Link to="/registre" className="underline">
          Registra't
        </Link>
      </p>
    </main>
  )
}

export default LoginPage