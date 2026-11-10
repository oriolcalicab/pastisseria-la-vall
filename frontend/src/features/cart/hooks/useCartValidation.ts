import { useEffect, useRef, useState } from 'react'
import { validateCart } from '../services/cartApi'
import { getCartNotices } from '../utils/cartNotices'
import { useCart } from './useCart'

export const useCartValidation = () => {
  const { lines, replaceLines } = useCart()
  const initialLines = useRef(lines)
  const [notices, setNotices] = useState<string[]>([])
  const [hasFailed, setHasFailed] = useState(false)

  useEffect(() => {
    const linesToValidate = initialLines.current

    if (linesToValidate.length === 0) return

    let isActive = true

    validateCart(linesToValidate)
      .then((result) => {
        if (!isActive) return

        replaceLines(result.lines)
        setNotices(getCartNotices(result.warnings, linesToValidate))
      })
      .catch(() => {
        if (isActive) setHasFailed(true)
      })

    return () => {
      isActive = false
    }
  }, [replaceLines])

  return { notices, hasFailed }
}
