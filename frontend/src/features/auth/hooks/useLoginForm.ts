import { useState } from 'react'
import type { FormEvent } from 'react'
import { getLoginErrorMessage } from '../loginErrorMessage'
import { loginAccount } from '../services/accountService'
import type { LoginErrors, LoginValues } from '../types/type'
import { validateLogin } from '../validation'

const INITIAL_VALUES: LoginValues = { email: '', password: '' }

export const useLoginForm = (onSuccess: () => void) => {
  const [values, setValues] = useState<LoginValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<LoginErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setValue = (field: keyof LoginValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError('')

    const validationErrors = validateLogin(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await loginAccount(values.email, values.password)
      onSuccess()
    } catch (error) {
      setSubmitError(getLoginErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return { values, errors, submitError, isSubmitting, setValue, handleSubmit }
}
