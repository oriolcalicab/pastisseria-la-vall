import { useState } from 'react'
import { Navigate } from 'react-router-dom'
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

type CheckoutStep = 'date' | 'method' | 'review'

const emptyAddress: ShippingAddress = { address: '', city: 'Barcelona', postalCode: '' }

const getMethodHint = (method: DeliveryMethod | null, pickupPoint: PickupPoint | null) => {
  if (!method) return 'Tria com vols rebre la comanda per continuar.'
  if (method === 'pickup' && !pickupPoint) return 'Tria un punt de recollida per continuar.'

  return null
}

const CheckoutPage = () => {
  const { lines, totalCents } = useCart()
  const [step, setStep] = useState<CheckoutStep>('date')
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null)
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(null)
  const [pickupPoint, setPickupPoint] = useState<PickupPoint | null>(null)
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress)
  const [addressErrors, setAddressErrors] = useState<ShippingAddressErrors>({})
  const [initialMonth] = useState(() => getCurrentMonth(new Date()))
  const shippingFee = useShippingFee()

  if (lines.length === 0) return <Navigate to="/carreto" replace />

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

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-8">
      <h1 className="text-3xl font-bold">Finalitza la comanda</h1>

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_18rem]">
        <div>
          {step === 'date' && (
            <section aria-labelledby="date-title">
              <h2 id="date-title" className="text-xl font-semibold">
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
                <p id="date-hint" className="mt-4 text-sm text-gray-600">
                  Tria una data per continuar.
                </p>
              )}
              <button
                type="button"
                onClick={() => setStep('method')}
                disabled={!deliveryDate}
                aria-describedby={deliveryDate ? undefined : 'date-hint'}
                className="mt-4 rounded-sm bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
              >
                Continua
              </button>
            </section>
          )}

          {step === 'method' && deliveryDate && (
            <section aria-labelledby="method-title">
              <h2 id="method-title" className="text-xl font-semibold">
                Pas 2 · Mètode de lliurament
              </h2>
              <p className="mt-4">Data de lliurament: {getDayLabel(deliveryDate)}</p>
              <button
                type="button"
                onClick={() => setStep('date')}
                className="mt-2 text-sm underline"
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

              {deliveryMethod === 'pickup' && (
                <PickupPoints selectedId={pickupPoint?.id ?? null} onSelect={setPickupPoint} />
              )}

              {methodHint && (
                <p id="method-hint" className="mt-4 text-sm text-gray-600">
                  {methodHint}
                </p>
              )}
              <button
                type="button"
                onClick={handleMethodContinue}
                disabled={methodHint !== null}
                aria-describedby={methodHint ? 'method-hint' : undefined}
                className="mt-4 rounded-sm bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
              >
                Continua
              </button>
            </section>
          )}

          {step === 'review' && deliveryDate && deliveryMethod && (
            <section aria-labelledby="review-title">
              <h2 id="review-title" className="text-xl font-semibold">
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
              <button
                type="button"
                onClick={() => setStep('method')}
                className="mt-4 text-sm underline"
              >
                {deliveryMethod === 'delivery' ? "Canvia l'adreça" : 'Canvia el punt de recollida'}
              </button>
            </section>
          )}
        </div>

        <aside aria-labelledby="summary-title" className="h-fit rounded-sm border p-4">
          <h2 id="summary-title" className="text-lg font-semibold">
            Resum
          </h2>
          <ul className="mt-2 space-y-1">
            {lines.map((line) => (
              <li key={line.variantId} className="flex justify-between gap-4">
                <span>
                  {line.quantity} × {line.productName} ({line.variantName})
                </span>
                <span>{formatPrice(line.priceCents * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t pt-2 text-right font-bold">
            Subtotal: {formatPrice(totalCents)}
          </p>
        </aside>
      </div>
    </main>
  )
}

export default CheckoutPage
