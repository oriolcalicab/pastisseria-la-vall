import FormField from '../../components/FormField'
import { useRegisterForm } from '../../features/auth/hooks/useRegisterForm'
import { Link } from 'react-router-dom'

export default function RegisterPage() {
  const { values, errors, submitError, isSubmitting, isSuccess, setValue, handleSubmit } =
    useRegisterForm()

  if (isSuccess) {
    return (
      <main className="mx-auto max-w-md px-4 py-12 text-center md:py-16">
        <p className="eyebrow">Benvingut a la Vall</p>
        <h1 className="page-title mt-2 font-display">Compte creat!</h1>
        <p className="mt-4 text-mocha">Ja pots fer servir el teu compte</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12 md:py-16">
      <p className="eyebrow">Uneix-te a la Vall</p>
      <h1 className="page-title mt-2 font-display">Crea el teu compte</h1>

      <form onSubmit={handleSubmit} noValidate className="card mt-8 space-y-5">
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
          <p role="alert" className="text-sm text-red-700">
            {submitError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
          {isSubmitting ? 'Creant el compte...' : "Registra'm"}
        </button>
      </form>

      <p className="mt-6 text-center text-mocha">
        Ja tens compte?{' '}
        <Link to="/login" className="link font-medium">
          Inicia la sessió
        </Link>
      </p>
    </main>
  )
}
