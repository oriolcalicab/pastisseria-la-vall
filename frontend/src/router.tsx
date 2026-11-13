import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import ShopLayout from './components/ShopLayout'
import AdminLayout from './features/admin/components/AdminLayout'
import AdminRoute from './features/auth/components/AdminRoute'
import ProtectedRoute from './features/auth/components/ProtectedRoute'
import {
  AccountPage,
  AdminCalendarPage,
  AdminDashboardPage,
  AdminOrderDetailPage,
  AdminOrdersPage,
  AdminProductsPage,
  CartPage,
  CheckoutPage,
  ConfirmationPage,
  EditProductPage,
  ForgotPasswordPage,
  LoginPage,
  NewProductPage,
  OrderDetailPage,
  OrdersPage,
  ProductDetailPage,
  ProductsPage,
  RegisterPage,
} from './lazyPages'
import NotFoundPage from './pages/errors/NotFoundPage'
import HomePage from './pages/HomePage'

export const routes: RouteObject[] = [
  {
    element: <ShopLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/productes', element: <ProductsPage /> },
      { path: '/productes/:id', element: <ProductDetailPage /> },
      { path: '/carreto', element: <CartPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/registre', element: <RegisterPage /> },
      { path: '/contrasenya-oblidada', element: <ForgotPasswordPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/checkout', element: <CheckoutPage /> },
          { path: '/confirmacio/:id', element: <ConfirmationPage /> },
          { path: '/comandes', element: <OrdersPage /> },
          { path: '/comandes/:id', element: <OrderDetailPage /> },
          { path: '/compte', element: <AccountPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'comandes', element: <AdminOrdersPage /> },
          { path: 'comandes/:id', element: <AdminOrderDetailPage /> },
          { path: 'calendari', element: <AdminCalendarPage /> },
          { path: 'productes', element: <AdminProductsPage /> },
          { path: 'productes/nou', element: <NewProductPage /> },
          { path: 'productes/:id/editar', element: <EditProductPage /> },
        ],
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
