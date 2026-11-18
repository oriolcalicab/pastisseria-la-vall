import { Link } from 'react-router-dom'
import FormField from '../../components/FormField'
import { useForgotPasswordForm } from '../../features/auth/hooks/useForgotPasswordForm'

const ForgotPasswordPage = () => {
  const { email, emailError, submitError, isSubmitting, isSent, setEmail, handleSubmit } =
    useForgotPasswordForm()

  if (isSent) {
    return (
      <main className="mx-auto max-w-md px-4 py-12 md:py-16">
        <p className="eyebrow">Correu enviat</p>
        <h1 className="page-title mt-2 font-display">Revisa el correu</h1>
        <p role="status" className="card mt-8 text-mocha">
          Si el correu està registrat, rebràs un missatge amb les instruccions per restablir la
          contrasenya.
        </p>
        <p className="mt-6 text-center">
          <Link to="/login" className="link">
            Torna a l'inici de sessió
          </Link>
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12 md:py-16">
      <p className="eyebrow">Cap problema</p>
      <h1 className="page-title mt-2 font-display">Has oblidat la contrasenya?</h1>
      <p className="mt-3 text-mocha">
        Escriu el teu correu i t'enviarem un enllaç per restablir-la.
      </p>

      <form onSubmit={handleSubmit} noValidate className="card mt-8 space-y-5">
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
          <p role="alert" className="text-sm text-red-700">
            {submitError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
          {isSubmitting ? 'Enviant...' : "Envia l'enllaç"}
        </button>
      </form>

      <p className="mt-6 text-center">
        <Link to="/login" className="link">
          Torna a l'inici de sessió
        </Link>
      </p>
    </main>
  )
}

export default ForgotPasswordPage
