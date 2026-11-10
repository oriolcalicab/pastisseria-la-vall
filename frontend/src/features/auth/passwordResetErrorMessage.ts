import { hasErrorCode } from './utils/hasErrorCode'

export const getPasswordResetErrorMessage = (error: unknown): string => {
  if (hasErrorCode(error, 'auth/too-many-requests')) {
    return 'Massa intents. Prova-ho més tard.'
  }

  return "No s'ha pogut enviar el correu. Torna-ho a provar."
}
