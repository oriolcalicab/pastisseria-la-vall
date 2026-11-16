import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import PageLoader from './PageLoader'

const ShopLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <div className="flex-1">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </div>
    <Footer />
  </div>
)

export default ShopLayout
