import { createBrowserRouter } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/errors/NotFoundPage'
import RegisterPage from './pages/auth/RegisterPage'
import LoginPage from './pages/auth/LoginPage'
import ProtectedRoute from './features/auth/components/ProtectedRoute'
import AccountPage from './pages/account/AccountPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import AdminRoute from './features/auth/components/AdminRoute'
import AdminLayout from './features/admin/components/AdminLayout'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import NewProductPage from './pages/admin/NewProductPage'
import ProductsPage from './pages/catalog/ProductsPage'
import ProductDetailPage from './pages/catalog/ProductDetailPage'
import ShopLayout from './components/ShopLayout'
import CartPage from './pages/cart/CartPage'
import CheckoutPage from './pages/checkout/CheckoutPage'
import ConfirmationPage from './pages/orders/ConfirmationPage'
import OrdersPage from './pages/orders/OrdersPage'
import OrderDetailPage from './pages/orders/OrderDetailPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'

export const router = createBrowserRouter([
  {
    element: <ShopLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/productes', element: <ProductsPage /> },
      { path: '/productes/:id', element: <ProductDetailPage /> },
      { path: '/carreto', element: <CartPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/checkout', element: <CheckoutPage /> },
          { path: '/confirmacio/:id', element: <ConfirmationPage /> },
          { path: '/comandes', element: <OrdersPage /> },
          { path: '/comandes/:id', element: <OrderDetailPage /> },
        ],
      },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/registre', element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [{ path: '/compte', element: <AccountPage /> }],
  },
  { path: '/contrasenya-oblidada', element: <ForgotPasswordPage /> },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'comandes', element: <AdminOrdersPage /> },
          { path: 'productes', element: <AdminProductsPage /> },
          { path: 'productes/nou', element: <NewProductPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
