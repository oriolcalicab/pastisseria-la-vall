import FormField from '../components/FormField'
import { useRegisterForm } from '../features/auth/hooks/useRegisterForm'
import { Link } from 'react-router-dom'

export default function RegisterPage() {
  const {
    values,
    errors,
    submitError,
    isSubmitting,
    isSuccess,
    setValue,
    handleSubmit,
  } = useRegisterForm()

  if (isSuccess) {
    return (
      <main className="mx-auto max-w-md p-8">
        <h1 className="text-2xl font-bold">Compte creat!</h1>
        <p className="mt-4">Ja pots fer servir el teu compte</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-bold">Crea el teu compte</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <FormField
          id="name"
          label="Nom"
          type="text"
          autoComplete="name"
          value={values.name}
          error={errors.name}
          onChange={(value) => setValue('name', value)}
        />
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
          autoComplete="new-password"
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
          {isSubmitting ? 'Creant el compte...' : "Registra'm"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Ja tens compte?{' '}
        <Link to="/login" className="underline">
          Inicia la sessió
        </Link>
      </p>
      
    </main>
  )
}
