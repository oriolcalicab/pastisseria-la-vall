type StatusBadgeProps = {
  isActive: boolean
}

const StatusBadge = ({ isActive }: StatusBadgeProps) => (
  <span
    className={`rounded px-2 py-0.5 text-xs ${
      isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
    }`}
  >
    {isActive ? 'Actiu' : 'Inactiu'}
  </span>
)

export default StatusBadge