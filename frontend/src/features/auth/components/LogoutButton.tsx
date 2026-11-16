import { useCart } from '../../cart/hooks/useCart'
import { logout } from '../services/sessionService'

type LogoutButtonProps = {
  className?: string
}

const LogoutButton = ({ className = 'rounded border px-3 py-1' }: LogoutButtonProps) => {
  const { clear } = useCart()

  const handleLogout = () => {
    clear()
    void logout()
  }

  return (
    <button type="button" onClick={handleLogout} className={className}>
      Tanca la sessió
    </button>
  )
}

export default LogoutButton
