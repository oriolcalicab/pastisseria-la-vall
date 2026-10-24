import type { RegisterErrors, RegisterValues } from "./types/type"


export const MIN_PASSWORD_LENGTH = 8
const MIN_NAME_LENGTH = 2
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

export function validateName(name: string): string | undefined{
    if(name.trim().length < MIN_NAME_LENGTH){
        return `El nom ha de tenir almenys ${MIN_NAME_LENGTH} caracters`
    }
}

export function validateEmail(email: string): string | undefined{
    if(!EMAIL_PATTERN.test(email.trim())){
        return `Escriu un correu vàlid`
    }
}

export function validatePassword(password: string): string | undefined {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `La contrasenya ha de tenir almenys ${MIN_PASSWORD_LENGTH} caràcters`
  }
}

export function validateRegister(values: RegisterValues): RegisterErrors{
    const errors: RegisterErrors = {}

    const nameError = validateName(values.name)
    const emailError = validateEmail(values.email)
    const passwordError = validatePassword(values.password)

    if (nameError) errors.name = nameError
    if (emailError) errors.email = emailError
    if (passwordError) errors.password = passwordError

    return errors

}