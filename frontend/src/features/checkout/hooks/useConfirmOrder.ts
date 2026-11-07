import { useRef, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { createOrder, OrderRequestError } from '../services/checkoutApi'
import type { CreatedOrder, OrderPayload } from '../types/checkout'

type ConfirmStatus = 'idle' | 'sending' | 'error' | 'done'

export const useConfirmOrder = () => {
  const { user } = useAuth()
  const isSending = useRef(false)
  const [status, setStatus] = useState<ConfirmStatus>('idle')
  const [error, setError] = useState<OrderRequestError | null>(null)
  const [order, setOrder] = useState<CreatedOrder | null>(null)

  const confirm = async (payload: OrderPayload) => {
    if (!user || isSending.current) return

    isSending.current = true
    setStatus('sending')
    setError(null)

    try {
      setOrder(await createOrder(await user.getIdToken(), payload))
      setStatus('done')
    } catch (caught) {
      setError(
        caught instanceof OrderRequestError
          ? caught
          : new OrderRequestError("No s'ha pogut confirmar la comanda. Torna-ho a provar"),
      )
      setStatus('error')
      isSending.current = false
    }
  }

   const reset = () => {
    setError(null)
    setStatus('idle')
  }

  return { status, error, order, confirm, reset }
}
