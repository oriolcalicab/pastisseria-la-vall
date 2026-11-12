import { NavLink } from 'react-router-dom'
import { adminMenu } from '../data/adminMenu'
import { adminNavLinkClassName } from '../utils/adminNavLinkClassName'
import NavIcon from './icons/NavIcon'

const AdminNav = () => (
  <nav aria-label="Menú d'administració" className="order-3 w-full md:order-2 md:mt-2">
    <ul className="flex scrollbar-none gap-2 overflow-x-auto px-4 pb-3 md:flex-col md:gap-1 md:overflow-visible md:pb-0">
      {adminMenu.map((item) => (
        <li key={item.to}>
          <NavLink to={item.to} end={item.end} className={adminNavLinkClassName}>
            <NavIcon paths={item.iconPaths} className="hidden md:block" />
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
)

export default AdminNav
