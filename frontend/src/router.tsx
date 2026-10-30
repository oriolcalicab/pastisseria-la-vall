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

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/productes', element: <ProductsPage /> },
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
          { path: 'productes', element: <AdminProductsPage /> },
          { path: 'productes/nou', element: <NewProductPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
