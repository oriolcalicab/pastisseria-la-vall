type QuantityStepperProps = {
  label: string
  quantity: number
  onDecrease: () => void
  onIncrease: () => void
}

const QuantityStepper = ({ label, quantity, onDecrease, onIncrease }: QuantityStepperProps) => (
  <div className="inline-flex h-11 items-center gap-4 rounded-full bg-white px-4 ring-1 ring-field ring-inset">
    <button
      type="button"
      onClick={onDecrease}
      disabled={quantity <= 1}
      aria-label={`Treu una unitat de ${label}`}
      className="text-lg transition-colors hover:text-caramel disabled:opacity-40"
    >
      −
    </button>
    <span aria-label={`Quantitat de ${label}`} className="min-w-4 text-center">
      {quantity}
    </span>
    <button
      type="button"
      onClick={onIncrease}
      aria-label={`Afegeix una unitat de ${label}`}
      className="text-lg transition-colors hover:text-caramel"
    >
      +
    </button>
  </div>
)

export default QuantityStepper
