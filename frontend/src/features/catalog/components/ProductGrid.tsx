import type { Product } from '../types/product'
import ProductCard from './ProductCard'

type ProductGridProps = {
  products: Product[]
}

const ProductGrid = ({ products }: ProductGridProps) => (
  <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 lg:grid-cols-4">
    {products.map((product) => (
      <li key={product.id}>
        <ProductCard product={product} />
      </li>
    ))}
  </ul>
)

export default ProductGrid
