export type RegisterValues = {
  name: string
  email: string
  password: string
}

export type RegisterErrors = Partial<Record<keyof RegisterValues, string>>