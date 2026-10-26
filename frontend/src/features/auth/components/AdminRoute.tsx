import { Navigate, Outlet, useLocation } from 'react-router-dom'
import AccessDeniedPage from '../../../pages/AccessDeniedPage'
import { useCurrentUser } from '../hooks/useCurrentUser'

const AdminRoute = () => {
  const { currentUser, isLoading } = useCurrentUser()
  const location = useLocation()

  if (isLoading) {
    return <p className="p-8">Comprovant la sessió...</p>
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (currentUser.role !== 'admin') {
    return <AccessDeniedPage />
  }

  return <Outlet />
}

export default AdminRoute
