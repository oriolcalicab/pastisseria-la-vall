import type { AdminProduct } from '../types/product'
import { formatPrice, getFromPriceCents, getTotalStock } from '../utils/productSummary'

type ProductsTableProps = {
  products: AdminProduct[]
}

const columns = ['Nom', 'Categoria', 'Des de', 'Variants', 'Stock', 'Estat']

const ProductsTable = ({ products }: ProductsTableProps) => (
  <div className="overflow-x-auto rounded border">
    <table className="w-full text-left text-sm">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th key={column} scope="col" className="px-4 py-2 font-semibold">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {products.map((product) => {
          const fromPriceCents = getFromPriceCents(product.variants)

          return (
            <tr key={product.id} className="border-t">
              <td className="px-4 py-2 font-medium">{product.name}</td>
              <td className="px-4 py-2">{product.category.name}</td>
              <td className="px-4 py-2">
                {fromPriceCents === null ? '—' : formatPrice(fromPriceCents)}
              </td>
              <td className="px-4 py-2">{product.variants.length}</td>
              <td className="px-4 py-2">{getTotalStock(product.variants)}</td>
              <td className="px-4 py-2">
                <span
                  className={`rounded px-2 py-0.5 text-xs ${
                    product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {product.isActive ? 'Actiu' : 'Inactiu'}
                </span>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)

export default ProductsTable