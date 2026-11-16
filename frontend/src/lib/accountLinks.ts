import { accountLink, adminLink, loginLink, registerLink } from '../data/navigationLinks'
import type { NavigationLink } from '../data/navigationLinks'

export const getAccountLinks = (isLoggedIn: boolean, isAdmin: boolean): NavigationLink[] => {
  if (!isLoggedIn) return [loginLink, registerLink]

  return isAdmin ? [adminLink, accountLink] : [accountLink]
}
