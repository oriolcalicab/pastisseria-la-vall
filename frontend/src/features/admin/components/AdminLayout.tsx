import { Suspense } from 'react'
import { Link, Outlet } from 'react-router-dom'
import PageLoader from '../../../components/PageLoader'
import LogoutButton from '../../auth/components/LogoutButton'
import AdminNav from './AdminNav'

const AdminLayout = () => (
  <div className="min-h-screen bg-cream md:flex">
    <aside className="flex flex-wrap items-center border-b border-line bg-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:flex-col md:flex-nowrap md:items-stretch md:border-r md:border-b-0 md:bg-nata">
      <Link to="/admin" className="order-1 flex-1 px-4 py-3 md:flex-none md:px-6 md:pt-8 md:pb-4">
        <span className="block font-display text-2xl leading-none md:text-3xl">La Vall</span>
        <span className="mt-1 block text-[0.65rem] font-medium tracking-widest text-caramel uppercase">
          Administració
        </span>
      </Link>

      <div className="order-2 flex items-center gap-3 px-4 text-sm md:order-3 md:mt-auto md:flex-col md:items-start md:gap-2 md:border-t md:border-line md:px-6 md:py-6">
        <Link to="/" className="text-mocha hover:text-caramel">
          Veure la botiga
        </Link>
        <LogoutButton className="text-mocha hover:text-caramel" />
      </div>

      <AdminNav />
    </aside>

    <main className="min-w-0 flex-1 px-4 py-6 md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </div>
    </main>
  </div>
)

export default AdminLayout
