export const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `transition-colors hover:text-caramel ${isActive ? 'font-medium text-caramel' : ''}`
