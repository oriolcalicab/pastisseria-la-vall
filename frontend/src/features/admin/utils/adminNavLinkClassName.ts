const baseClassName =
  'flex shrink-0 items-center gap-3 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors md:rounded-xl md:px-3 md:py-2.5 md:text-base'

export const adminNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `${baseClassName} ${
    isActive
      ? 'bg-cocoa font-medium text-white'
      : 'text-chocolate ring-1 ring-field ring-inset hover:bg-nata md:ring-0 md:hover:bg-white/70'
  }`
