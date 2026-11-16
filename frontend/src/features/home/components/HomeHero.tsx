import { Link } from 'react-router-dom'
import HeroImage from './HeroImage'

const HomeHero = () => (
  <section className="relative isolate flex min-h-[calc(100svh-4.5rem)] items-end overflow-hidden bg-espresso px-6 pt-24 pb-24 md:min-h-[calc(100svh-5.5rem)] md:items-center md:px-8 md:py-20">
    <HeroImage />

    <div className="mx-auto w-full max-w-6xl">
      <div className="max-w-xl text-cream motion-safe:animate-hero-arrive">
        <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.22em] text-gold uppercase before:h-px before:w-8 before:bg-current">
          Pastisseria artesana · Barcelona
        </p>
        <h1 className="mt-6 font-display text-6xl leading-[0.95] tracking-tight md:text-8xl">
          Les coses bones <em className="text-gold">volen el seu temps.</em>
        </h1>
        <p className="mt-6 max-w-md leading-relaxed text-nata/85 md:text-lg">
          Pastissos i cupcakes fets a mà, en petites fornades. Per celebrar-ho tot, també els dies
          de cada dia.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link
            to="/productes"
            className="btn bg-nata text-chocolate transition hover:-translate-y-0.5 hover:bg-cream"
          >
            Veure productes
          </Link>
          <a
            href="#com-funciona"
            className="border-b border-cream/55 py-2 text-cream hover:border-gold hover:text-gold"
          >
            Com funciona
          </a>
        </div>
      </div>
    </div>
  </section>
)

export default HomeHero
