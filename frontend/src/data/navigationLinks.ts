export type NavigationLink = {
  to: string
  label: string
  end?: boolean
}

export const mainLinks: NavigationLink[] = [
  { to: '/', label: 'Inici', end: true },
  { to: '/productes', label: 'Productes' },
]

export const shopLinks: NavigationLink[] = [
  { to: '/productes', label: 'Productes' },
  { to: '/carreto', label: 'Carretó' },
  { to: '/comandes', label: 'Les meves comandes' },
]
