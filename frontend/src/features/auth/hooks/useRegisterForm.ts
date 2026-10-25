import { useState } from 'react'
import type { FormEvent } from 'react'
import { EmailAlreadyInUseError } from '../services/authService'
import type { RegisterErrors, RegisterValues } from '../types/type'
import { validateRegister } from '../validation'
import { registerAccount } from '../services/accountService'

const INITIAL_VALUES: RegisterValues = { name: '', email: '', password: '' }

function getSubmitErrorMessage(error: unknown): string {
  if (error instanceof EmailAlreadyInUseError) {
    return 'Aquest correu ja està registrat'
  }
  return "No s'ha pogut crear el compte. Torna-ho a provar."
}

export function useRegisterForm() {
  const [values, setValues] = useState<RegisterValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  function setValue(field: keyof RegisterValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError('')

    const validationErrors = validateRegister(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await registerAccount(values)
      setIsSuccess(true)
    } catch (error) {
      setSubmitError(getSubmitErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    values,
    errors,
    submitError,
    isSubmitting,
    isSuccess,
    setValue,
    handleSubmit,
  }
}
