type StatusBadgeProps = {
  isActive: boolean
}

const StatusBadge = ({ isActive }: StatusBadgeProps) => (
  <span
    className={`rounded-full px-3 py-0.5 text-xs font-medium ${
      isActive ? 'bg-green-100 text-green-900' : 'bg-nata text-mocha'
    }`}
  >
    {isActive ? 'Actiu' : 'Inactiu'}
  </span>
)

export default StatusBadge
