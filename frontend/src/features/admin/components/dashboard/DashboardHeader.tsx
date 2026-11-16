import { useDashboard } from '../../hooks/useDashboard'
import CustomRangeForm from './CustomRangeForm'
import RangePresetButtons from './RangePresetButtons'

const DashboardHeader = () => {
  const { range } = useDashboard()

  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="eyebrow">Administració</p>
        <h1 className="page-title mt-1 font-display">Tauler</h1>
      </div>

      <div className="flex flex-col gap-4">
        <RangePresetButtons />
        <CustomRangeForm key={`${range.from}|${range.to}`} />
      </div>
    </header>
  )
}

export default DashboardHeader
