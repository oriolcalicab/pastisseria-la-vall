import type { Product } from '../types/product'
import { getDietLabels } from '../utils/dietLabels'

type DietTagsProps = {
  product: Product
  className?: string
}

const DietTags = ({ product, className = '' }: DietTagsProps) => {
  const labels = getDietLabels(product)

  if (labels.length === 0) return null

  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {labels.map((label) => (
        <li key={label} className="tag">
          {label}
        </li>
      ))}
    </ul>
  )
}

export default DietTags
