type ProductAllergensProps = {
  allergens: string | null
}

const ProductAllergens = ({ allergens }: ProductAllergensProps) => (
  <section className="mt-10 border-t border-line pt-6">
    <h2 className="text-2xl">Ingredients i al·lèrgens</h2>
    {allergens && <p className="mt-2">Al·lèrgens: {allergens}</p>}
    <p className="mt-2 text-sm text-mocha">
      Elaborat en un obrador compartit: pot contenir traces de gluten, ous, llet i fruits de closca.
    </p>
  </section>
)

export default ProductAllergens
