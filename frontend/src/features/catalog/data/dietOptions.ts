import type { Diet, Product } from '../types/product'

type DietFlag = keyof Pick<Product, 'isGlutenFree' | 'isPlantMilk' | 'isVegan'>

type DietOption = {
  diet: Diet
  flag: DietFlag
  label: string
}

export const dietOptions: DietOption[] = [
  { diet: 'gluten_free', flag: 'isGlutenFree', label: 'Sense gluten' },
  { diet: 'plant_milk', flag: 'isPlantMilk', label: 'Llet vegetal' },
  { diet: 'vegan', flag: 'isVegan', label: 'Vegà' },
]
