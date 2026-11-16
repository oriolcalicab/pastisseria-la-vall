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

export const loginLink: NavigationLink = { to: '/login', label: 'Inicia sessió' }

export const accountLink: NavigationLink = { to: '/compte', label: 'El meu compte' }

export const adminLink: NavigationLink = { to: '/admin', label: 'Administració' }
