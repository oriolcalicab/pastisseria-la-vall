import { hasErrorCode } from './utils/hasErrorCode'

const INVALID_CREDENTIALS_CODES = [
  'auth/invalid-credential',
  'auth/wrong-password',
  'auth/user-not-found',
]

export const getLoginErrorMessage = (error: unknown): string => {
  if (INVALID_CREDENTIALS_CODES.some((code) => hasErrorCode(error, code))) {
    return 'Correu o contrasenya incorrectes'
  }

  if (hasErrorCode(error, 'auth/too-many-requests')) {
    return 'Massa intents fallits. Prova-ho més tard.'
  }

  return "No s'ha pogut iniciar la sessió. Torna-ho a provar."
}
