import { logout } from '../services/sessionService'

const LogoutButton = () => (
  <button
    type="button"
    onClick={() => {
      void logout()
    }}
    className="rounded border px-3 py-1"
  >
    Tanca la sessió
  </button>
)

export default LogoutButton
