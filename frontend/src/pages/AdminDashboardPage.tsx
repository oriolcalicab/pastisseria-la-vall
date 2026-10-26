import { useCurrentUser } from '../features/auth/hooks/useCurrentUser'

const AdminDashboardPage = () => {
  const { currentUser } = useCurrentUser()

  return (
    <>
      <h1 className="text-2xl font-bold">Tauler</h1>
      <p className="mt-4">Benvingut/da, {currentUser?.name}.</p>
    </>
  )
}

export default AdminDashboardPage