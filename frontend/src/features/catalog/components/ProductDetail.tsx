import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../../lib/formatPrice'
import type { Product } from '../types/product'
import { useCart } from '../../cart/hooks/useCart'
import { getDefaultVariant } from '../utils/defaultVariant'
import { getProductImageUrl } from '../utils/productImage'
import VariantSelector from './VariantSelector'

type ProductDetailProps = {
  product: Product
}

const getDietLabels = (product: Product) =>
  [
    product.isGlutenFree && 'Sense gluten',
    product.isPlantMilk && 'Amb llet vegetal',
    product.isVegan && 'Vegà',
  ].filter((label) => label !== false)

const ProductDetail = ({ product }: ProductDetailProps) => {
  const [selectedId, setSelectedId] = useState(
    () => getDefaultVariant(product.variants)?.id ?? null,
  )
  const selectedVariant = product.variants.find((variant) => variant.id === selectedId)
  const dietLabels = getDietLabels(product)
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleSelect = (id: number) => {
    setSelectedId(id)
    setIsAdded(false)
  }

  const handleAdd = () => {
    if (!selectedVariant) return

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      variantName: selectedVariant.name,
      priceCents: selectedVariant.priceCents,
      imageUrl: product.imageUrl,
    })
    setIsAdded(true)
  }

  return (
    <article className="mt-4 grid gap-8 md:grid-cols-2">
      <img
        src={getProductImageUrl(product.imageUrl)}
        alt={product.name}
        className="aspect-square w-full rounded object-cover"
      />

      <div>
        <p className="text-sm text-gray-600">{product.category.name}</p>
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <p className="mt-4 text-2xl font-semibold">
          {selectedVariant ? formatPrice(selectedVariant.priceCents) : 'Esgotat'}
        </p>

        <p className="mt-4">{product.description}</p>

        {dietLabels.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {dietLabels.map((label) => (
              <li key={label} className="rounded bg-green-100 px-2 py-0.5 text-sm text-green-800">
                {label}
              </li>
            ))}
          </ul>
        )}

        {product.allergens && <p className="mt-4 text-sm">Al·lèrgens: {product.allergens}</p>}

        <div className="mt-6">
          <VariantSelector
            variants={product.variants}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectedVariant}
          className="mt-6 rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
        >
          Afegeix al carretó
        </button>

        {isAdded && (
          <p role="status" className="mt-3 text-sm text-green-800">
            Afegit al carretó ·{' '}
            <Link to="/carreto" className="underline">
              Veure el carretó
            </Link>
          </p>
        )}
      </div>
    </article>
  )
}

export default ProductDetail
