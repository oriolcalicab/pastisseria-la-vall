import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { createAdminProduct } from '../services/adminProductsApi'
import type { AdminProduct } from '../types/product'
import type {
  ProductFlag,
  ProductFormErrors,
  ProductFormValues,
  VariantField,
  VariantFormValues,
} from '../types/productForm'
import { validateProductForm } from '../utils/productForm'

type ProductTextField = 'categoryId' | 'name' | 'description' | 'allergens'

const createEmptyVariant = (key: number): VariantFormValues => ({ key, name: '', price: '', stock: '' })

const createInitialValues = (): ProductFormValues => ({
  categoryId: '',
  name: '',
  description: '',
  allergens: '',
  isGlutenFree: false,
  isPlantMilk: false,
  isVegan: false,
  isActive: true,
  variants: [createEmptyVariant(1)],
})

export const useProductForm = (onSuccess: (product: AdminProduct) => void) => {
  const { user } = useAuth()
  const [values, setValues] = useState(createInitialValues)
  const [errors, setErrors] = useState<ProductFormErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const nextVariantKey = useRef(2)

  const setField = (field: ProductTextField, value: string) =>
    setValues((current) => ({ ...current, [field]: value }))

  const setFlag = (flag: ProductFlag, value: boolean) =>
    setValues((current) => ({ ...current, [flag]: value }))

  const setVariantField = (key: number, field: VariantField, value: string) =>
    setValues((current) => ({
      ...current,
      variants: current.variants.map((variant) =>
        variant.key === key ? { ...variant, [field]: value } : variant,
      ),
    }))

  const addVariant = () => {
    const key = nextVariantKey.current
    nextVariantKey.current += 1
    setValues((current) => ({ ...current, variants: [...current.variants, createEmptyVariant(key)] }))
  }

  const removeVariant = (key: number) => {
    const index = values.variants.findIndex((variant) => variant.key === key)

    if (values.variants.length <= 1 || index === -1) return

    setValues((current) => ({
      ...current,
      variants: current.variants.filter((variant) => variant.key !== key),
    }))
    setErrors((current) =>
      current.variantErrors
        ? { ...current, variantErrors: current.variantErrors.filter((_, i) => i !== index) }
        : current,
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError('')

    const result = validateProductForm(values)

    if (!result.ok) {
      setErrors(result.errors)
      return
    }

    setErrors({})

    if (!user) return

    setIsSubmitting(true)

    try {
      const token = await user.getIdToken()
      const product = await createAdminProduct(token, result.product)
      onSuccess(product)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No s'ha pogut crear el producte")
      setIsSubmitting(false)
    }
  }

  return {
    values,
    errors,
    submitError,
    isSubmitting,
    setField,
    setFlag,
    setVariantField,
    addVariant,
    removeVariant,
    handleSubmit,
  }
}