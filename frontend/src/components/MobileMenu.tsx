import { NavLink } from 'react-router-dom'
import type { NavigationLink } from '../data/navigationLinks'
import { navLinkClassName } from '../lib/navLinkClassName'

type MobileMenuProps = {
  links: NavigationLink[]
  isOpen: boolean
  onNavigate: () => void
}

const MobileMenu = ({ links, isOpen, onNavigate }: MobileMenuProps) => (
  <nav
    id="mobile-menu"
    aria-label="Menú del mòbil"
    hidden={!isOpen}
    className="border-t border-line px-4 pb-2 md:hidden"
  >
    <ul>
      {links.map((link) => (
        <li key={link.to}>
          <NavLink to={link.to} end={link.end} onClick={onNavigate} className={navLinkClassName}>
            <span className="block py-3">{link.label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
)

export default MobileMenu
