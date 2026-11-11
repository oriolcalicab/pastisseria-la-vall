import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../features/auth/hooks/useAuth'
import { useCart } from '../features/cart/hooks/useCart'
import { HeaderLogo } from './Logo'

const links = [
  { to: '/', label: 'Inici', end: true },
  { to: '/productes', label: 'Productes', end: false },
]

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  `transition-colors hover:text-caramel ${isActive ? 'font-medium text-caramel' : ''}`

const BagIcon = () => (
  <svg
    aria-hidden="true"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 10a4 4 0 0 1-8 0" />
    <path d="M3.1 6h17.8" />
    <path d="M3.4 5.5 6 2h12l2.6 3.5a2 2 0 0 1 .4 1.2V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.7a2 2 0 0 1 .4-1.2Z" />
  </svg>
)

const MenuIcon = () => (
  <svg
    aria-hidden="true"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const Header = () => {
  const { itemCount } = useCart()
  const { user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const account = user
    ? { to: '/compte', label: 'El meu compte' }
    : { to: '/login', label: 'Inicia sessió' }

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-cream">
      <div className="mx-auto grid h-18 max-w-6xl grid-cols-[1fr_auto] items-center px-4 md:h-22 md:grid-cols-[1fr_auto_1fr] md:px-8">
        <Link to="/" onClick={closeMenu} className="justify-self-start">
          <HeaderLogo className="h-10 w-auto md:h-12" />
        </Link>

        <nav aria-label="Menú principal" className="hidden gap-9 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClassName}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-4 md:gap-6">
          <NavLink
            to={account.to}
            className={(state) => `hidden md:inline ${linkClassName(state)}`}
          >
            {account.label}
          </NavLink>
          <NavLink
            to="/carreto"
            onClick={closeMenu}
            aria-label={`Carretó, ${itemCount} unitats`}
            className="flex items-center gap-2 transition-colors hover:text-caramel"
          >
            <BagIcon />
            <span>{itemCount}</span>
          </NavLink>
          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Tanca el menú' : 'Obre el menú'}
            className="md:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Menú del mòbil"
        hidden={!isMenuOpen}
        className="border-t border-line px-4 pb-2 md:hidden"
      >
        <ul>
          {[...links, { ...account, end: false }].map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.end} onClick={closeMenu} className={linkClassName}>
                <span className="block py-3">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header
