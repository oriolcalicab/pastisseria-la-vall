import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '../../features/cart/hooks/useCart'
import AddressForm from '../../features/checkout/components/AddressForm'
import DeliveryMethodSelector from '../../features/checkout/components/DeliveryMethodSelector'
import type {
  DeliveryMethod,
  ShippingAddress,
  ShippingAddressErrors,
} from '../../features/checkout/types/checkout'
import { validateShippingAddress } from '../../features/checkout/utils/shippingAddress'
import DeliveryCalendar from '../../features/delivery/components/DeliveryCalendar'
import { getCurrentMonth, getDayLabel } from '../../features/delivery/utils/calendar'
import PickupPoints from '../../features/pickup/components/PickupPoints'
import type { PickupPoint } from '../../features/pickup/types/pickupPoint'
import { formatPrice } from '../../lib/formatPrice'
import OrderReview from '../../features/checkout/components/OrderReview'
import { useShippingFee } from '../../features/checkout/hooks/useShippingFee'
import { useConfirmOrder } from '../../features/checkout/hooks/useConfirmOrder'
import { buildOrderPayload } from '../../features/checkout/utils/orderPayload'
import OrderErrorNotice from '../../features/checkout/components/OrderErrorNotice'

type CheckoutStep = 'date' | 'method' | 'review'

const emptyAddress: ShippingAddress = { address: '', city: 'Barcelona', postalCode: '' }

const getMethodHint = (method: DeliveryMethod | null, pickupPoint: PickupPoint | null) => {
  if (!method) return 'Tria com vols rebre la comanda per continuar.'
  if (method === 'pickup' && !pickupPoint) return 'Tria un punt de recollida per continuar.'

  return null
}

const CheckoutPage = () => {
  const { lines, totalCents, clear } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState<CheckoutStep>('date')
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null)
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(null)
  const [pickupPoint, setPickupPoint] = useState<PickupPoint | null>(null)
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress)
  const [addressErrors, setAddressErrors] = useState<ShippingAddressErrors>({})
  const [initialMonth] = useState(() => getCurrentMonth(new Date()))
  const shippingFee = useShippingFee()
  const [idempotencyKey] = useState(() => crypto.randomUUID())
  const confirmOrder = useConfirmOrder()

  if (lines.length === 0 && confirmOrder.status !== 'done') {
    return <Navigate to="/carreto" replace />
  }

  const methodHint = getMethodHint(deliveryMethod, pickupPoint)

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((current) => ({ ...current, [field]: value }))
    setAddressErrors((current) =>
      Object.fromEntries(Object.entries(current).filter(([key]) => key !== field)),
    )
  }

  const handleMethodContinue = () => {
    if (deliveryMethod === 'delivery') {
      const result = validateShippingAddress(address)

      if (!result.ok) {
        setAddressErrors(result.errors)
        return
      }

      setAddress(result.address)
    }

    setStep('review')
  }

  const handleBackToMethod = () => {
    confirmOrder.reset()
    setStep('method')
  }

  const handleChangeDate = () => {
    confirmOrder.reset()
    setDeliveryDate(null)
    setStep('date')
  }

  const handleChangePickupPoint = () => {
    confirmOrder.reset()
    setPickupPoint(null)
    setStep('method')
  }

  const handleConfirm = async () => {
    if (!deliveryDate || !deliveryMethod) return

    const order = await confirmOrder.confirm(
      buildOrderPayload({
        idempotencyKey,
        deliveryDate,
        method: deliveryMethod,
        pickupPointId: pickupPoint?.id ?? null,
        address,
        lines,
      }),
    )

    if (!order) return

    clear()
    navigate(`/confirmacio/${order.id}`, { replace: true })
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <p className="eyebrow">Gairebé a taula</p>
      <h1 className="page-title mt-2 font-display">Finalitza la comanda</h1>

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_20rem]">
        {step === 'date' && (
          <section aria-labelledby="date-title" className="md:col-start-1 md:row-start-1">
            <h2 id="date-title" className="font-display text-3xl">
              Pas 1 · Data de lliurament
            </h2>
            <div className="mt-4">
              <DeliveryCalendar
                initialMonth={initialMonth}
                selectedDate={deliveryDate}
                onSelect={setDeliveryDate}
              />
            </div>
            {!deliveryDate && (
              <p id="date-hint" className="mt-4 text-sm text-mocha">
                Tria una data per continuar.
              </p>
            )}
            <button
              type="button"
              onClick={() => setStep('method')}
              disabled={!deliveryDate}
              aria-describedby={deliveryDate ? undefined : 'date-hint'}
              className="btn btn-primary mt-6"
            >
              Continua
            </button>
          </section>
        )}

        {step === 'method' && deliveryDate && (
          <section aria-labelledby="method-title" className="contents">
            <div className="md:col-start-1 md:row-start-1">
              <h2 id="method-title" className="font-display text-3xl">
                Pas 2 · Mètode de lliurament
              </h2>
              <p className="mt-4 text-mocha">Data de lliurament: {getDayLabel(deliveryDate)}</p>
              <button
                type="button"
                onClick={() => setStep('date')}
                className="mt-1 text-sm text-caramel hover:underline"
              >
                Canvia la data
              </button>

              <div className="mt-6">
                <DeliveryMethodSelector value={deliveryMethod} onChange={setDeliveryMethod} />
              </div>

              {deliveryMethod === 'delivery' && (
                <div className="mt-6">
                  <AddressForm
                    values={address}
                    errors={addressErrors}
                    onChange={handleAddressChange}
                  />
                </div>
              )}
            </div>

            {deliveryMethod === 'pickup' && (
              <PickupPoints selectedId={pickupPoint?.id ?? null} onSelect={setPickupPoint} />
            )}

            <div className="md:col-start-1">
              {methodHint && (
                <p id="method-hint" className="text-sm text-mocha">
                  {methodHint}
                </p>
              )}
              <button
                type="button"
                onClick={handleMethodContinue}
                disabled={methodHint !== null}
                aria-describedby={methodHint ? 'method-hint' : undefined}
                className="btn btn-primary mt-6"
              >
                Continua
              </button>
            </div>
          </section>
        )}

        {step === 'review' && deliveryDate && deliveryMethod && (
          <section aria-labelledby="review-title" className="md:col-start-1 md:row-start-1">
            <h2 id="review-title" className="font-display text-3xl">
              Pas 3 · Revisió
            </h2>
            <OrderReview
              lines={lines}
              subtotalCents={totalCents}
              deliveryDate={deliveryDate}
              method={deliveryMethod}
              address={address}
              pickupPoint={pickupPoint}
              shippingFee={shippingFee}
            />

            {confirmOrder.error && (
              <OrderErrorNotice
                error={confirmOrder.error}
                onChangeDate={handleChangeDate}
                onChangePickupPoint={handleChangePickupPoint}
              />
            )}

            <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={handleBackToMethod} className="btn btn-outline btn-sm">
                {deliveryMethod === 'delivery' ? "Canvia l'adreça" : 'Canvia el punt de recollida'}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={confirmOrder.status === 'sending' || confirmOrder.status === 'done'}
                className="btn btn-primary"
              >
                {confirmOrder.status === 'idle' || confirmOrder.status === 'error'
                  ? 'Confirma la comanda'
                  : 'Confirmant...'}
              </button>
            </div>
          </section>
        )}

        <aside aria-labelledby="summary-title" className="card h-fit md:col-start-2 md:row-start-1">
          <h2 id="summary-title" className="font-display text-2xl">
            Resum
          </h2>
          <ul className="mt-3 divide-y divide-line text-sm">
            {lines.map((line) => (
              <li key={line.variantId} className="flex justify-between gap-4 py-2">
                <span>
                  {line.quantity} × {line.productName} ({line.variantName})
                </span>
                <span className="whitespace-nowrap">
                  {formatPrice(line.priceCents * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-line pt-3 text-right font-display text-xl">
            Subtotal: {formatPrice(totalCents)}
          </p>
        </aside>
      </div>
    </main>
  )
}

export default CheckoutPage
