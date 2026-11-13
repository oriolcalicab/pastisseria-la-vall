import { productStatusOptions } from '../data/productStatusOptions'
import { useCategories } from '../hooks/useCategories'
import type { ProductStatusFilter } from '../types/product'

type ProductFiltersProps = {
  categoryId: string
  status: ProductStatusFilter
  onCategoryChange: (categoryId: string) => void
  onStatusChange: (status: ProductStatusFilter) => void
}

const selectClassName = 'mt-1 block rounded border px-3 py-1'

const ProductFilters = ({
  categoryId,
  status,
  onCategoryChange,
  onStatusChange,
}: ProductFiltersProps) => {
  const categories = useCategories()

  return (
    <div className="flex flex-wrap gap-4">
      <label className="text-sm">
        Categoria
        <select
          value={categoryId}
          onChange={(event) => onCategoryChange(event.target.value)}
          disabled={categories.status !== 'success'}
          className={selectClassName}
        >
          <option value="">Totes</option>
          {categories.status === 'success' &&
            categories.categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
        </select>
      </label>

      <label className="text-sm">
        Estat
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as ProductStatusFilter)}
          className={selectClassName}
        >
          {productStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

export default ProductFilters
