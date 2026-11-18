import { Link } from 'react-router-dom'
import LogoutButton from '../../features/auth/components/LogoutButton'
import { useAuth } from '../../features/auth/hooks/useAuth'

const AccountPage = () => {
  const { user } = useAuth()

  return (
    <main className="mx-auto max-w-xl px-4 py-12 md:py-16">
      <p className="eyebrow">El teu espai</p>
      <h1 className="page-title mt-2 font-display">El meu compte</h1>

      <dl className="card mt-8 space-y-4">
        <div>
          <dt className="text-sm text-mocha">Nom</dt>
          <dd className="mt-1 text-lg">{user?.displayName}</dd>
        </div>
        <div>
          <dt className="text-sm text-mocha">Correu</dt>
          <dd className="mt-1 text-lg break-all">{user?.email}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/comandes" className="btn btn-primary">
          Les meves comandes
        </Link>
        <LogoutButton className="btn btn-outline" />
      </div>
    </main>
  )
}

export default AccountPage
