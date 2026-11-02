import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { CartContext } from './CartContext'
import { loadCart, saveCart } from './services/cartStorage'
import type { NewCartLine } from './types/cart'
import {
  addLine,
  getCartItemCount,
  getCartTotalCents,
  removeLine,
  setLineQuantity,
} from './utils/cartLines'

type CartProviderProps = {
  children: ReactNode
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [lines, setLines] = useState(loadCart)

  useEffect(() => {
    saveCart(lines)
  }, [lines])

  const addItem = (line: NewCartLine, quantity = 1) =>
    setLines((current) => addLine(current, line, quantity))

  const setQuantity = (variantId: number, quantity: number) =>
    setLines((current) => setLineQuantity(current, variantId, quantity))

  const removeItem = (variantId: number) => setLines((current) => removeLine(current, variantId))

  const clear = () => setLines([])

  const value = {
    lines,
    itemCount: getCartItemCount(lines),
    totalCents: getCartTotalCents(lines),
    addItem,
    setQuantity,
    removeItem,
    clear,
    replaceLines: setLines,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
