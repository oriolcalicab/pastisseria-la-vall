import { createBrowserRouter } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './features/auth/components/ProtectedRoute'
import AccountPage from './pages/AccountPage'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/registre', element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [{ path: '/compte', element: <AccountPage /> }],
  },
  { path: '*', element: <NotFoundPage /> },
])
