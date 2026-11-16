import DashboardContent from '../../features/admin/components/dashboard/DashboardContent'
import DashboardHeader from '../../features/admin/components/dashboard/DashboardHeader'
import { DashboardProvider } from '../../features/admin/context/DashboardProvider'

const AdminDashboardPage = () => (
  <DashboardProvider>
    <DashboardHeader />
    <DashboardContent />
  </DashboardProvider>
)

export default AdminDashboardPage
