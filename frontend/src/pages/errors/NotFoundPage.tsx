import { Link } from 'react-router-dom'
import { ValleyMark } from '../../components/Logo'

const NotFoundPage = () => (
  <main className="mx-auto max-w-lg px-4 py-16 text-center md:py-24">
    <svg viewBox="0 10 80 40" aria-hidden="true" className="mx-auto w-24">
      <ValleyMark />
    </svg>
    <p className="mt-4 font-display text-7xl text-caramel">404</p>
    <h1 className="page-title mt-2 font-display">Pàgina no trobada</h1>
    <p className="mt-4 text-mocha">La pàgina que busques no existeix o ja no està disponible.</p>
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <Link to="/productes" className="btn btn-primary">
        Veure els productes
      </Link>
      <Link to="/" className="btn btn-outline">
        Torna a l'inici
      </Link>
    </div>
  </main>
)

export default NotFoundPage
