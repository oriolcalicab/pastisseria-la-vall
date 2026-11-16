type NavIconProps = {
  paths: string[]
  className?: string
}

const NavIcon = ({ paths, className }: NavIconProps) => (
  <svg
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {paths.map((path) => (
      <path key={path} d={path} />
    ))}
  </svg>
)

export default NavIcon
