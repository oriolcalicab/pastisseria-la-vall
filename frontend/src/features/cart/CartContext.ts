import { createContext } from 'react'
import type { CartLine, NewCartLine } from './types/cart'

export type CartContextValue = {
  lines: CartLine[]
  itemCount: number
  totalCents: number
  addItem: (line: NewCartLine, quantity?: number) => void
  setQuantity: (variantId: number, quantity: number) => void
  removeItem: (variantId: number) => void
  clear: () => void
  replaceLines: (lines: CartLine[]) => void
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)
