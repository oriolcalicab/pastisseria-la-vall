import { useEffect, useState } from 'react'
import { fetchShippingFee } from '../services/checkoutApi'

type ShippingFeeResult = {
  attempt: number
  feeCents: number | null
}

export type ShippingFeeState = (
  { status: 'loading' } | { status: 'error' } | { status: 'success'; feeCents: number }
) & { retry: () => void }

export const useShippingFee = (): ShippingFeeState => {
  const [result, setResult] = useState<ShippingFeeResult | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let isActive = true

    fetchShippingFee()
      .then((feeCents) => {
        if (isActive) setResult({ attempt, feeCents })
      })
      .catch(() => {
        if (isActive) setResult({ attempt, feeCents: null })
      })

    return () => {
      isActive = false
    }
  }, [attempt])

  const retry = () => setAttempt((current) => current + 1)

  if (result?.attempt !== attempt) return { status: 'loading', retry }
  if (result.feeCents === null) return { status: 'error', retry }

  return { status: 'success', feeCents: result.feeCents, retry }
}
