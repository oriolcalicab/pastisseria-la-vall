export type RegisterValues = {
  name: string
  email: string
  password: string
}

export type RegisterErrors = Partial<Record<keyof RegisterValues, string>>

export type LoginValues = {
  email: string
  password: string
}

export type LoginErrors = Partial<Record<keyof LoginValues, string>>
