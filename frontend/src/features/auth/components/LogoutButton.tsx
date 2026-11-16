import { logout } from '../services/sessionService'

type LogoutButtonProps = {
  className?: string
}

const LogoutButton = ({ className = 'rounded border px-3 py-1' }: LogoutButtonProps) => (
  <button
    type="button"
    onClick={() => {
      void logout()
    }}
    className={className}
  >
    Tanca la sessió
  </button>
)

export default LogoutButton
