import { Link } from 'react-router-dom'
import { SealLogo } from '../../../components/Logo'

const HomeHero = () => (
  <section className="mx-auto grid max-w-6xl items-center gap-7 px-4 pt-8 pb-10 md:grid-cols-2 md:gap-16 md:px-8 md:pt-14 md:pb-16">
    <div>
      <p className="eyebrow">Pastisseria artesana · Barcelona</p>
      <h1 className="mt-4 text-5xl leading-none md:text-7xl">
        Les coses bones volen el seu temps.
      </h1>
      <p className="mt-5 max-w-md text-mocha md:text-lg">
        Pastissos i cupcakes fets a mà, en petites fornades. Per celebrar-ho tot, també els dies de
        cada dia.
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
      className="flex h-80 items-center justify-center rounded-3xl bg-nata md:h-[540px]"
    >
      <SealLogo className="w-48 md:w-72" />
    </div>
  </section>
)

export default HomeHero
