import { formatPrice } from '../../../lib/formatPrice'
import type { ProductVariant } from '../types/product'

type VariantSelectorProps = {
  variants: ProductVariant[]
  selectedId: number | null
  onSelect: (id: number) => void
}

const VariantSelector = ({ variants, selectedId, onSelect }: VariantSelectorProps) => (
  <fieldset>
    <legend className="font-medium">Tria una opció</legend>
    <div className="mt-2 space-y-2">
      {variants.map((variant) => (
        <label
          key={variant.id}
          className={`flex items-center gap-2 ${variant.inStock ? '' : 'text-gray-400'}`}
        >
          <input
            type="radio"
            name="variant"
            value={variant.id}
            checked={variant.id === selectedId}
            disabled={!variant.inStock}
            onChange={() => onSelect(variant.id)}
          />
          <span>{variant.name}</span>
          <span>{variant.inStock ? formatPrice(variant.priceCents) : 'Esgotat'}</span>
        </label>
      ))}
    </div>
  </fieldset>
)

export default VariantSelector