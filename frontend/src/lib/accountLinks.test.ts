import { describe, expect, it } from 'vitest'
import { getAccountLinks } from './accountLinks'

const labels = (isLoggedIn: boolean, isAdmin: boolean) =>
  getAccountLinks(isLoggedIn, isAdmin).map((link) => link.label)

describe('getAccountLinks', () => {
  it('invites a visitor to sign in', () => {
    expect(labels(false, false)).toEqual(['Inicia sessió'])
  })

  it('links a customer to the account', () => {
    expect(labels(true, false)).toEqual(['El meu compte'])
  })

  it('links an admin to the admin panel and to the account', () => {
    expect(getAccountLinks(true, true)).toEqual([
      { to: '/admin', label: 'Administració' },
      { to: '/compte', label: 'El meu compte' },
    ])
  })
})
