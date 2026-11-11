import { Link } from 'react-router-dom'
import { formatPrice } from '../../../lib/formatPrice'
import type { Product } from '../types/product'
import { getDietLabels } from '../utils/dietLabels'
import { getFromPriceCents } from '../utils/fromPrice'
import { getProductImageUrl } from '../utils/productImage'

type ProductCardProps = {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dietLabels = getDietLabels(product)

  return (
    <Link to={`/productes/${product.id}`} className="group block">
      <article>
        <div className="overflow-hidden rounded-2xl bg-nata">
          <img
            src={getProductImageUrl(product.imageUrl)}
            alt={product.name}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
        <h2 className="mt-3 text-2xl leading-tight transition-colors group-hover:text-caramel">
          {product.name}
        </h2>
        <p className="mt-1 text-mocha">Des de {formatPrice(getFromPriceCents(product.variants))}</p>
        {dietLabels.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {dietLabels.map((label) => (
              <li key={label} className="tag">
                {label}
              </li>
            ))}
          </ul>
        )}
      </article>
    </Link>
  )
}

export default ProductCard
