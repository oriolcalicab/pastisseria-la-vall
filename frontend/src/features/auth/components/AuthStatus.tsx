import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LogoutButton from './LogoutButton'

const AuthStatus = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <p>Comprovant la sessió...</p>
  }

  if (!user) {
    return (
      <p>
        <Link to="/login" className="underline">
          Inicia la sessió
        </Link>{' '}
        o{' '}
        <Link to="/registre" className="underline">
          crea un compte
        </Link>
      </p>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <p>Hola, {user.displayName || user.email}</p>
      <LogoutButton />
    </div>
  )
}

export default AuthStatus