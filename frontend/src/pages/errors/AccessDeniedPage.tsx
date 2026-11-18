import { Link } from 'react-router-dom'
import { ValleyMark } from '../../components/Logo'

const AccessDeniedPage = () => (
  <main className="mx-auto max-w-lg px-4 py-16 text-center md:py-24">
    <svg viewBox="0 10 80 40" aria-hidden="true" className="mx-auto w-24">
      <ValleyMark />
    </svg>
    <p className="eyebrow mt-4">Zona reservada</p>
    <h1 className="page-title mt-2 font-display">Accés denegat</h1>
    <p className="mt-4 text-mocha">No tens permís per veure aquesta pàgina.</p>
    <Link to="/" className="btn btn-primary mt-8">
      Torna a l'inici
    </Link>
  </main>
)

export default AccessDeniedPage
