import { Link } from 'react-router-dom'
import { SealLogo } from './Logo'

const shopLinks = [
  { to: '/productes', label: 'Productes' },
  { to: '/carreto', label: 'Carretó' },
  { to: '/comandes', label: 'Les meves comandes' },
]

const Footer = () => (
  <footer className="mt-16 border-t border-line">
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr] md:items-center md:px-8">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <SealLogo className="w-32 shrink-0 md:w-40" />
        <p className="max-w-xs text-mocha">
          Pastissos i cupcakes artesans a Barcelona, també sense gluten, amb llet vegetal i vegans.
        </p>
      </div>

      <nav aria-label="Enllaços de la botiga">
        <p className="text-xs font-medium tracking-wide uppercase">La botiga</p>
        <ul className="mt-2 space-y-1">
          {shopLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="transition-colors hover:text-caramel">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>

    <p className="mx-auto max-w-6xl border-t border-line px-4 py-5 text-xs text-mocha md:px-8">
      © 2026 Oriol Calí | Projecta Final | It Academy Barcelona Activa.
    </p>
  </footer>
)

export default Footer
