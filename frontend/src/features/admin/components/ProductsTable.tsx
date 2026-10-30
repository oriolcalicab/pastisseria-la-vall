import { Fragment, useState } from 'react'
import type { AdminProduct, AdminProductVariant } from '../types/product'
import { formatPrice, getFromPriceCents, getTotalStock } from '../utils/productSummary'
import StatusBadge from './StatusBadge'

type ProductsTableProps = {
  products: AdminProduct[]
  pendingKey: string | null
  onToggleProduct: (product: AdminProduct) => void
  onToggleVariant: (product: AdminProduct, variant: AdminProductVariant) => void
}

const columns = ['Nom', 'Categoria', 'Des de', 'Variants', 'Stock', 'Estat']

const toggleText = (isActive: boolean, isPending: boolean) => {
  if (isPending) return 'Desant...'

  return isActive ? 'Desactiva' : 'Activa'
}

const ProductsTable = ({
  products,
  pendingKey,
  onToggleProduct,
  onToggleVariant,
}: ProductsTableProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggleExpanded = (productId: number) =>
    setExpandedId((current) => (current === productId ? null : productId))

  return (
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
            const isExpanded = expandedId === product.id
            const variantsId = `variants-${product.id}`

            return (
              <Fragment key={product.id}>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">{product.name}</td>
                  <td className="px-4 py-2">{product.category.name}</td>
                  <td className="px-4 py-2">
                    {fromPriceCents === null ? '—' : formatPrice(fromPriceCents)}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => toggleExpanded(product.id)}
                      aria-expanded={isExpanded}
                      aria-controls={variantsId}
                      aria-label={`${isExpanded ? 'Amaga' : 'Mostra'} les variants de ${product.name}`}
                      className="underline"
                    >
                      {isExpanded ? 'Amaga' : 'Mostra'} ({product.variants.length})
                    </button>
                  </td>
                  <td className="px-4 py-2">{getTotalStock(product.variants)}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <StatusBadge isActive={product.isActive} />
                      <button
                        type="button"
                        onClick={() => onToggleProduct(product)}
                        disabled={pendingKey !== null}
                        aria-label={`${product.isActive ? 'Desactiva' : 'Activa'} ${product.name}`}
                        className="text-xs underline disabled:opacity-50"
                      >
                        {toggleText(product.isActive, pendingKey === `product-${product.id}`)}
                      </button>
                    </div>
                  </td>
                </tr>

                {isExpanded && (
                  <tr id={variantsId} className="bg-gray-50">
                    <td colSpan={columns.length} className="px-4 py-2">
                      <ul className="space-y-2">
                        {product.variants.map((variant) => (
                          <li key={variant.id} className="flex flex-wrap items-center gap-3">
                            <span className="font-medium">{variant.name}</span>
                            <span>{formatPrice(variant.priceCents)}</span>
                            <span>Stock: {variant.stock}</span>
                            <StatusBadge isActive={variant.isActive} />
                            <button
                              type="button"
                              onClick={() => onToggleVariant(product, variant)}
                              disabled={pendingKey !== null}
                              aria-label={`${variant.isActive ? 'Desactiva' : 'Activa'} la variant ${variant.name} de ${product.name}`}
                              className="text-xs underline disabled:opacity-50"
                            >
                              {toggleText(variant.isActive, pendingKey === `variant-${variant.id}`)}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ProductsTable