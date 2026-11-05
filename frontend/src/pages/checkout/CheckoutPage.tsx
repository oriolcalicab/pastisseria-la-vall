import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useCart } from '../../features/cart/hooks/useCart'
import DeliveryCalendar from '../../features/delivery/components/DeliveryCalendar'
import { getCurrentMonth, getDayLabel } from '../../features/delivery/utils/calendar'
import { formatPrice } from '../../lib/formatPrice'
import PickupPoints from '../../features/pickup/components/PickupPoints'

type CheckoutStep = 'date' | 'method'

const CheckoutPage = () => {
  const { lines, totalCents } = useCart()
  const [step, setStep] = useState<CheckoutStep>('date')
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null)
  const [initialMonth] = useState(() => getCurrentMonth(new Date()))

  if (lines.length === 0) return <Navigate to="/carreto" replace />

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
              <PickupPoints />
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
            Total: {formatPrice(totalCents)}
          </p>
        </aside>
      </div>
    </main>
  )
}

export default CheckoutPage
