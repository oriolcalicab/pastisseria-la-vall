import type { ProductStatusFilter } from '../types/product'

export const productStatusOptions: { value: ProductStatusFilter; label: string }[] = [
  { value: '', label: 'Tots' },
  { value: 'active', label: 'Actius' },
  { value: 'inactive', label: 'Inactius' },
]
