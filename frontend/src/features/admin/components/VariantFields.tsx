import FormField from '../../../components/FormField'
import type { VariantField, VariantFormErrors, VariantFormValues } from '../types/productForm'

type VariantFieldsProps = {
  variants: VariantFormValues[]
  errors: VariantFormErrors[] | undefined
  listError: string | undefined
  onChange: (key: number, field: VariantField, value: string) => void
  onAdd: () => void
  onRemove: (key: number) => void
}

const VariantFields = ({
  variants,
  errors,
  listError,
  onChange,
  onAdd,
  onRemove,
}: VariantFieldsProps) => (
  <section aria-labelledby="variants-title">
    <h2 id="variants-title" className="text-2xl">
      Variants
    </h2>
    {listError && (
      <p role="alert" className="mt-1 text-sm text-red-700">
        {listError}
      </p>
    )}

    <div className="mt-2 space-y-4">
      {variants.map((variant, index) => {
        const position = index + 1
        const variantErrors = errors?.[index]

        return (
          <fieldset key={variant.key} className="rounded-2xl border border-line bg-cream p-4">
            <legend className="px-1 font-medium">Variant {position}</legend>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                id={`variant-${variant.key}-name`}
                label="Nom"
                type="text"
                value={variant.name}
                error={variantErrors?.name}
                onChange={(value) => onChange(variant.key, 'name', value)}
              />
              <FormField
                id={`variant-${variant.key}-price`}
                label="Preu (€)"
                type="text"
                inputMode="decimal"
                value={variant.price}
                error={variantErrors?.price}
                onChange={(value) => onChange(variant.key, 'price', value)}
              />
              <FormField
                id={`variant-${variant.key}-stock`}
                label="Stock"
                type="text"
                inputMode="numeric"
                value={variant.stock}
                error={variantErrors?.stock}
                onChange={(value) => onChange(variant.key, 'stock', value)}
              />
            </div>
            {variant.id ? (
              <p className="mt-3 text-sm text-mocha">
                Per amagar aquesta variant, desactiva-la a la llista de productes.
              </p>
            ) : (
              <button
                type="button"
                onClick={() => onRemove(variant.key)}
                disabled={variants.length <= 1}
                className="mt-3 text-sm text-red-700 underline disabled:text-mocha disabled:no-underline"
              >
                Treu la variant {position}
              </button>
            )}
          </fieldset>
        )
      })}
    </div>

    <button type="button" onClick={onAdd} className="btn btn-outline btn-sm mt-4">
      + Afegeix una variant
    </button>
  </section>
)

export default VariantFields
