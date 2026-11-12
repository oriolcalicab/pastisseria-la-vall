import { accountLink, adminLink, loginLink } from '../data/navigationLinks'
import type { NavigationLink } from '../data/navigationLinks'

export const getAccountLinks = (isLoggedIn: boolean, isAdmin: boolean): NavigationLink[] => {
  if (!isLoggedIn) return [loginLink]

  return isAdmin ? [adminLink, accountLink] : [accountLink]
}
