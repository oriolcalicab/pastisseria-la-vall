export const ROLES = ['customer', 'admin'] as const

export type RoleName = (typeof ROLES)[number]

export type SetRoleArgs = {
  email: string
  role: RoleName
}

const isRole = (value: string): value is RoleName => (ROLES as readonly string[]).includes(value)

export const parseSetRoleArgs = (args: string[]): SetRoleArgs | null => {
  const [email, role] = args

  if (!email || !role || !email.includes('@')) return null
  if (!isRole(role)) return null

  return { email: email.trim().toLowerCase(), role }
}