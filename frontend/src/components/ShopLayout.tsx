import { Link, NavLink, Outlet } from 'react-router-dom'
import { useCart } from '../features/cart/hooks/useCart'

const ShopLayout = () => {
  const { itemCount } = useCart()

  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 p-4">
          <Link to="/" className="text-lg font-bold">
            Pastisseria La Vall
          </Link>
          <nav aria-label="Menú principal" className="flex items-center gap-4">
            <NavLink to="/productes" className="underline-offset-4 hover:underline">
              Productes
            </NavLink>
            <NavLink
              to="/carreto"
              aria-label={`Carretó, ${itemCount} unitats`}
              className="underline-offset-4 hover:underline"
            >
              Carretó ({itemCount})
            </NavLink>
          </nav>
        </div>
      </header>
      <Outlet />
    </>
  )
}

export default ShopLayout