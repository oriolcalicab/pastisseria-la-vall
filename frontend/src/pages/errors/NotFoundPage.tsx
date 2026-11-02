import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <main className="mx-auto max-w-md p-8 text-center">
    <p className="text-6xl font-bold">404</p>
    <h1 className="mt-4 text-2xl font-bold">Pàgina no trobada</h1>
    <p className="mt-4">La pàgina que busques no existeix o ja no està disponible.</p>
    <Link to="/productes" className="mt-6 inline-block rounded bg-gray-900 px-4 py-2 text-white">
      Veure els productes
    </Link>
  </main>
)

export default NotFoundPage