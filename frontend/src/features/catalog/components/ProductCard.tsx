import { Link } from 'react-router-dom'
import { formatPrice } from '../../../lib/formatPrice'
import type { Product } from '../types/product'
import { getFromPriceCents } from '../utils/fromPrice'
import { getProductImageUrl } from '../utils/productImage'

type ProductCardProps = {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => (
  <Link to={`/productes/${product.id}`} className="block">
    <article className="overflow-hidden rounded border">
      <img
        src={getProductImageUrl(product.imageUrl)}
        alt={product.name}
        loading="lazy"
        className="aspect-square w-full object-cover"
      />
      <div className="p-3">
        <h2 className="font-semibold">{product.name}</h2>
        <p className="mt-1 text-sm">Des de {formatPrice(getFromPriceCents(product.variants))}</p>
      </div>
    </article>
  </Link>
)

export default ProductCard
