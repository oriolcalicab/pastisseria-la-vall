import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { mainLinks, type NavigationLink } from '../data/navigationLinks'
import { useAuth } from '../features/auth/hooks/useAuth'
import { useCart } from '../features/cart/hooks/useCart'
import { navLinkClassName } from '../lib/navLinkClassName'
import BagIcon from './icons/BagIcon'
import MenuIcon from './icons/MenuIcon'
import { HeaderLogo } from './Logo'
import MobileMenu from './MobileMenu'

const Header = () => {
  const { itemCount } = useCart()
  const { user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const account: NavigationLink = user
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
          {mainLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClassName}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-4 md:gap-6">
          <NavLink
            to={account.to}
            className={(state) => `hidden md:inline ${navLinkClassName(state)}`}
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

      <MobileMenu links={[...mainLinks, account]} isOpen={isMenuOpen} onNavigate={closeMenu} />
    </header>
  )
}

export default Header
