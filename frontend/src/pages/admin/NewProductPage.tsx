import { Link, useNavigate } from 'react-router-dom'
import FormField from '../../components/FormField'
import DietaryOptions from '../../features/admin/components/DietaryOptions'
import VariantFields from '../../features/admin/components/VariantFields'
import { useCategories } from '../../features/admin/hooks/useCategories'
import { useProductForm } from '../../features/admin/hooks/useProductForm'

const NewProductPage = () => {
  const navigate = useNavigate()
  const categories = useCategories()
  const form = useProductForm((product) =>
    navigate('/admin/productes', {
      state: { notice: `Producte "${product.name}" creat correctament` },
    }),
  )
  const { values, errors } = form

  return (
    <>
      <Link to="/admin/productes" className="text-sm underline">
        « Torna als productes
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Nou producte</h1>

      <form onSubmit={form.handleSubmit} noValidate className="mt-6 max-w-3xl space-y-6">
        <div>
          <label htmlFor="categoryId" className="block font-medium">
            Categoria
          </label>
          <select
            id="categoryId"
            value={values.categoryId}
            onChange={(event) => form.setField('categoryId', event.target.value)}
            disabled={categories.status !== 'success'}
            aria-invalid={errors.categoryId ? true : undefined}
            aria-describedby={errors.categoryId ? 'categoryId-error' : undefined}
            className="mt-1 w-full rounded border p-2"
          >
            <option value="">
              {categories.status === 'loading' ? 'Carregant categories...' : 'Tria una categoria'}
            </option>
            {categories.status === 'success' &&
              categories.categories.map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
          </select>
          {categories.status === 'error' && (
            <p role="alert" className="mt-1 text-sm text-red-600">
              No s'han pogut carregar les categories. Recarrega la pàgina.
            </p>
          )}
          {errors.categoryId && (
            <p id="categoryId-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.categoryId}
            </p>
          )}
        </div>

        <FormField
          id="name"
          label="Nom del producte"
          type="text"
          value={values.name}
          error={errors.name}
          onChange={(value) => form.setField('name', value)}
        />

        <div>
          <label htmlFor="description" className="block font-medium">
            Descripció
          </label>
          <textarea
            id="description"
            rows={4}
            value={values.description}
            onChange={(event) => form.setField('description', event.target.value)}
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={errors.description ? 'description-error' : undefined}
            className="mt-1 w-full rounded border p-2"
          />
          {errors.description && (
            <p id="description-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.description}
            </p>
          )}
        </div>

        <FormField
          id="allergens"
          label="Al·lèrgens (opcional, separats per comes)"
          type="text"
          value={values.allergens}
          error={errors.allergens}
          onChange={(value) => form.setField('allergens', value)}
        />

        <DietaryOptions values={values} onChange={form.setFlag} />

        <VariantFields
          variants={values.variants}
          errors={errors.variantErrors}
          listError={errors.variants}
          onChange={form.setVariantField}
          onAdd={form.addVariant}
          onRemove={form.removeVariant}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(event) => form.setFlag('isActive', event.target.checked)}
          />
          Actiu (visible a la botiga)
        </label>

        {form.submitError && (
          <p role="alert" className="text-sm text-red-600">
            {form.submitError}
          </p>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={form.isSubmitting}
            className="rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
          >
            {form.isSubmitting ? 'Desant...' : 'Desa el producte'}
          </button>
          <Link to="/admin/productes" className="underline">
            Cancel·la
          </Link>
        </div>
      </form>
    </>
  )
}

export default NewProductPage