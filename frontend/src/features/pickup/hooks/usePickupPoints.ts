import { useEffect, useState } from 'react'
import { fetchPickupPoints } from '../services/pickupPointsApi'
import type { PickupPoint } from '../types/pickupPoint'

type PickupPointsResult = {
  attempt: number
  points: PickupPoint[] | null
}

type PickupPointsState = (
  { status: 'loading' } | { status: 'error' } | { status: 'success'; points: PickupPoint[] }
) & { retry: () => void }

export const usePickupPoints = (): PickupPointsState => {
  const [result, setResult] = useState<PickupPointsResult | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let isActive = true

    fetchPickupPoints()
      .then((points) => {
        if (isActive) setResult({ attempt, points })
      })
      .catch(() => {
        if (isActive) setResult({ attempt, points: null })
      })

    return () => {
      isActive = false
    }
  }, [attempt])

  const retry = () => setAttempt((current) => current + 1)

  if (result?.attempt !== attempt) return { status: 'loading', retry }
  if (!result.points) return { status: 'error', retry }

  return { status: 'success', points: result.points, retry }
}
