import { dietOptions } from '../data/dietOptions'
import type { Product } from '../types/product'

export const getDietLabels = (product: Product): string[] =>
  dietOptions.filter(({ flag }) => product[flag]).map(({ label }) => label)
