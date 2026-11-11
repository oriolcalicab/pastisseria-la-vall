import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../../lib/formatPrice'
import { useCart } from '../../cart/hooks/useCart'
import type { Product } from '../types/product'
import { getDefaultVariant } from '../utils/defaultVariant'
import { getProductImageUrl } from '../utils/productImage'
import DietTags from './DietTags'
import ProductAllergens from './ProductAllergens'
import VariantSelector from './VariantSelector'

type ProductDetailProps = {
  product: Product
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const [selectedId, setSelectedId] = useState(
    () => getDefaultVariant(product.variants)?.id ?? null,
  )
  const selectedVariant = product.variants.find((variant) => variant.id === selectedId)
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
    <article className="mt-6 grid gap-8 md:grid-cols-2 md:gap-14">
      <div className="overflow-hidden rounded-3xl bg-nata">
        <img
          src={getProductImageUrl(product.imageUrl)}
          alt={product.name}
          className="aspect-square w-full object-cover"
        />
      </div>

      <div>
        <p className="eyebrow">{product.category.name}</p>
        <h1 className="page-title mt-3">{product.name}</h1>
        <p className="mt-4 text-mocha md:text-lg">{product.description}</p>
        <DietTags product={product} className="mt-4" />

        <div className="mt-8">
          <VariantSelector
            variants={product.variants}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>

        <p className="mt-6 font-display text-4xl">
          {selectedVariant ? formatPrice(selectedVariant.priceCents) : 'Esgotat'}
        </p>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectedVariant}
          className="btn btn-primary mt-4 w-full sm:w-auto"
        >
          Afegeix al carretó
        </button>

        {isAdded && (
          <p role="status" className="mt-3 text-sm">
            Afegit al carretó ·{' '}
            <Link to="/carreto" className="font-medium text-caramel underline">
              Veure el carretó
            </Link>
          </p>
        )}

        <ProductAllergens allergens={product.allergens} />
      </div>
    </article>
  )
}

export default ProductDetail
