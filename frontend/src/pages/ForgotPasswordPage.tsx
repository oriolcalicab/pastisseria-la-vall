import { Link } from 'react-router-dom'
import FormField from '../components/FormField'
import { useForgotPasswordForm } from '../features/auth/hooks/useForgotPasswordForm'

const ForgotPasswordPage = () => {
  const { email, emailError, submitError, isSubmitting, isSent, setEmail, handleSubmit } =
    useForgotPasswordForm()

  if (isSent) {
    return (
      <main className="mx-auto max-w-md p-8">
        <h1 className="text-2xl font-bold">Revisa el correu</h1>
        <p role="status" className="mt-4">
          Si el correu està registrat, rebràs un missatge amb les instruccions per restablir la
          contrasenya.
        </p>
        <p className="mt-4 text-sm">
          <Link to="/login" className="underline">
            Torna a l'inici de sessió
          </Link>
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-bold">Has oblidat la contrasenya?</h1>
      <p className="mt-2 text-sm">Escriu el teu correu i t'enviarem un enllaç per restablir-la.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <FormField
          id="email"
          label="Correu"
          type="email"
          autoComplete="email"
          value={email}
          error={emailError}
          onChange={setEmail}
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
          {isSubmitting ? 'Enviant...' : "Envia l'enllaç"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        <Link to="/login" className="underline">
          Torna a l'inici de sessió
        </Link>
      </p>
    </main>
  )
}

export default ForgotPasswordPage