import { useEffect, useState } from 'react'
import { fetchCategories } from '../services/categoriesApi'
import type { Category } from '../types/category'

type CategoriesState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; categories: Category[] }

export const useCategories = (): CategoriesState => {
  const [state, setState] = useState<CategoriesState>({ status: 'loading' })

  useEffect(() => {
    let isActive = true

    fetchCategories()
      .then((categories) => {
        if (isActive) setState({ status: 'success', categories })
      })
      .catch(() => {
        if (isActive) setState({ status: 'error' })
      })

    return () => {
      isActive = false
    }
  }, [])

  return state
}