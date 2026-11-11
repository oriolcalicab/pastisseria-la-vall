import { formatPrice } from '../../../lib/formatPrice'
import type { ProductVariant } from '../types/product'

type VariantSelectorProps = {
  variants: ProductVariant[]
  selectedId: number | null
  onSelect: (id: number) => void
}

const VariantSelector = ({ variants, selectedId, onSelect }: VariantSelectorProps) => (
  <fieldset>
    <legend className="font-medium">Tria la mida</legend>
    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {variants.map((variant) => (
        <label key={variant.id} className="option-card">
          <input
            type="radio"
            name="variant"
            value={variant.id}
            checked={variant.id === selectedId}
            disabled={!variant.inStock}
            onChange={() => onSelect(variant.id)}
            className="sr-only"
          />
          <span className="font-medium">{variant.name}</span>
          <span className="text-sm text-mocha">
            {variant.inStock ? formatPrice(variant.priceCents) : 'Esgotat'}
          </span>
        </label>
      ))}
    </div>
  </fieldset>
)

export default VariantSelector
