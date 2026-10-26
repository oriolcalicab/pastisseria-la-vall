import { Link } from 'react-router-dom'

const AccessDeniedPage = () => (
  <main className="mx-auto max-w-md p-8">
    <h1 className="text-2xl font-bold">Accés denegat</h1>
    <p className="mt-4">No tens permís per veure aquesta pàgina.</p>
    <Link to="/" className="mt-4 inline-block underline">
      Torna a l'inici
    </Link>
  </main>
)

export default AccessDeniedPage
