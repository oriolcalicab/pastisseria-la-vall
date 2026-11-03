import { Navigate } from 'react-router-dom'
import { useCart } from '../../features/cart/hooks/useCart'
import { formatPrice } from '../../lib/formatPrice'

const CheckoutPage = () => {
  const { lines, totalCents } = useCart()

  if (lines.length === 0) return <Navigate to="/carreto" replace />

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-8">
      <h1 className="text-3xl font-bold">Finalitza la comanda</h1>

      <section aria-labelledby="summary-title" className="mt-6 rounded-sm border p-4">
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
        <p className="mt-4 border-t pt-2 text-right font-bold">Total: {formatPrice(totalCents)}</p>
      </section>
    </main>
  )
}

export default CheckoutPage