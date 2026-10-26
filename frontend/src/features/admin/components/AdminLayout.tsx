import { Link, NavLink, Outlet } from 'react-router-dom'
import LogoutButton from '../../auth/components/LogoutButton'

const menuItems = [
  { to: '/admin', label: 'Tauler', end: true },
  { to: '/admin/comandes', label: 'Comandes', end: false },
  { to: '/admin/productes', label: 'Productes', end: false },
  { to: '/admin/categories', label: 'Categories', end: false },
]

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  `block rounded px-3 py-2 ${isActive ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'}`

const AdminLayout = () => (
  <div className="flex min-h-screen flex-col md:flex-row">
    <aside className="border-b p-4 md:w-60 md:border-r md:border-b-0">
      <Link to="/" className="text-lg font-bold">
        Pastisseria La Vall
      </Link>
      <p className="text-sm text-gray-500">Administració</p>

      <nav aria-label="Menú d'administració" className="mt-6">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.end} className={linkClassName}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </aside>

    <main className="flex-1 p-8">
      <Outlet />
    </main>
  </div>
)

export default AdminLayout
