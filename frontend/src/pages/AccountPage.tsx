import LogoutButton from '../features/auth/components/LogoutButton'
import { useAuth } from '../features/auth/hooks/useAuth'

const AccountPage = () => {
  const { user } = useAuth()

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-bold">El meu compte</h1>
      <p className="mt-4">Nom: {user?.displayName}</p>
      <p>Correu: {user?.email}</p>
      <div className="mt-4">
        <LogoutButton />
      </div>
    </main>
  )
}

export default AccountPage