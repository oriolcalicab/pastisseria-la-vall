import { useState } from 'react'
import type { FormEvent } from 'react'
import { getPasswordResetErrorMessage } from '../passwordResetErrorMessage'
import { requestPasswordReset } from '../services/passwordResetService'
import { validateEmail } from '../validation'

export const useForgotPasswordForm = () => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | undefined>(undefined)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError('')

    const validationError = validateEmail(email)
    setEmailError(validationError)
    if (validationError) return

    setIsSubmitting(true)
    try {
      await requestPasswordReset(email)
      setIsSent(true)
    } catch (error) {
      setSubmitError(getPasswordResetErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return { email, emailError, submitError, isSubmitting, isSent, setEmail, handleSubmit }
}