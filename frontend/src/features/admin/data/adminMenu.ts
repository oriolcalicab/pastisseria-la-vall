export type AdminMenuItem = {
  to: string
  label: string
  end: boolean
  iconPaths: string[]
}

export const adminMenu: AdminMenuItem[] = [
  {
    to: '/admin',
    label: 'Tauler',
    end: true,
    iconPaths: ['M4 20h16', 'M5 13h3v7H5z', 'M10.5 4h3v16h-3z', 'M16 9h3v11h-3z'],
  },
  {
    to: '/admin/comandes',
    label: 'Comandes',
    end: false,
    iconPaths: [
      'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-3-2-2 2-2-2-2 2-2-2-3 2',
      'M9 7h6',
      'M9 11h6',
      'M9 15h4',
    ],
  },
  {
    to: '/admin/calendari',
    label: 'Calendari',
    end: false,
    iconPaths: [
      'M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z',
      'M16 3v4',
      'M8 3v4',
      'M4 11h16',
    ],
  },
  {
    to: '/admin/productes',
    label: 'Productes',
    end: false,
    iconPaths: [
      'M3 20h18',
      'M5 20v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7',
      'M5 15.5c1.5 0 1.5-1 3.5-1s2 1 3.5 1 1.5-1 3.5-1 2 1 3.5 1',
      'M12 11V7',
    ],
  },
]
