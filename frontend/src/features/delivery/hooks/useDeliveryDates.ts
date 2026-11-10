import { useEffect, useState } from 'react'
import { fetchDeliveryDates } from '../services/deliveryApi'
import type { DeliveryDay } from '../types/delivery'

type DeliveryDatesResult = {
  key: string
  days: DeliveryDay[] | null
}

type DeliveryDatesState = (
  { status: 'loading' } | { status: 'error' } | { status: 'success'; days: DeliveryDay[] }
) & { retry: () => void }

export const useDeliveryDates = (month: string): DeliveryDatesState => {
  const [result, setResult] = useState<DeliveryDatesResult | null>(null)
  const [attempt, setAttempt] = useState(0)
  const key = `${month}|${attempt}`

  useEffect(() => {
    let isActive = true

    fetchDeliveryDates(month)
      .then((data) => {
        if (isActive) setResult({ key, days: data.days })
      })
      .catch(() => {
        if (isActive) setResult({ key, days: null })
      })

    return () => {
      isActive = false
    }
  }, [month, key])

  const retry = () => setAttempt((current) => current + 1)

  if (result?.key !== key) return { status: 'loading', retry }
  if (!result.days) return { status: 'error', retry }

  return { status: 'success', days: result.days, retry }
}
