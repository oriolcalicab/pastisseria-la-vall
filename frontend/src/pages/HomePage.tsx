import { Link } from 'react-router-dom'
import { SealLogo } from '../components/Logo'
import ProductCard from '../features/catalog/components/ProductCard'
import { useProducts } from '../features/catalog/hooks/useProducts'
import { homeSteps } from '../features/home/data/homeSteps'

const FEATURED_COUNT = 4



const HomePage = () => {
  const products = useProducts({ page: 1, diet: '' })

  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-7 px-4 pt-8 pb-10 md:grid-cols-2 md:gap-16 md:px-8 md:pt-14 md:pb-16">
        <div>
          <p className="eyebrow">Pastisseria artesana · Barcelona</p>
          <h1 className="mt-4 text-5xl leading-none md:text-7xl">
            Les coses bones volen el seu temps.
          </h1>
          <p className="mt-5 max-w-md text-mocha md:text-lg">
            Pastissos i cupcakes fets a mà, en petites fornades. Per celebrar-ho tot, també els dies
            de cada dia.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/productes" className="btn btn-primary">
              Veure productes
            </Link>
            <a href="#com-funciona" className="btn btn-outline">
              Com funciona
            </a>
          </div>
          <p className="mt-5 text-sm text-mocha">Del nostre obrador a la teva taula.</p>
        </div>
        <div
          aria-hidden="true"
          className="flex h-80 items-center justify-center rounded-3xl bg-nata md:h-135"
        >
          <SealLogo className="w-48 md:w-72" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-11 md:px-8 md:py-16">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="section-title">Els preferits de casa</h2>
          <Link to="/productes" className="font-medium text-caramel">
            Tots els productes →
          </Link>
        </div>

        <div className="mt-7">
          {products.status === 'loading' && <p>Carregant productes...</p>}
          {products.status === 'error' && (
            <div className="flex flex-wrap items-center gap-4">
              <p>No hem pogut carregar els productes.</p>
              <button type="button" onClick={products.retry} className="btn btn-outline btn-sm">
                Torna-ho a provar
              </button>
            </div>
          )}
          {products.status === 'success' && (
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {products.data.items.slice(0, FEATURED_COUNT).map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-6 text-sm text-mocha">
          La llet vegetal no implica que sigui vegà. Treballem en un obrador compartit: hi pot haver
          traces d’al·lèrgens.
        </p>
      </section>

      <section id="com-funciona" className="scroll-mt-24 bg-nata">
        <div className="mx-auto max-w-6xl px-4 py-11 md:px-8 md:py-16">
          <h2 className="section-title">Com funciona</h2>
          <ol className="mt-7 grid gap-6 md:grid-cols-3 md:gap-8">
            {homeSteps.map((step, index) => (
              <li key={step.title}>
                <span aria-hidden="true" className="font-display text-5xl leading-none text-caramel">
                  {index + 1}
                </span>
                <h3 className="mt-2 text-3xl">{step.title}</h3>
                <p className="mt-1 text-mocha">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  )
}

export default HomePage
