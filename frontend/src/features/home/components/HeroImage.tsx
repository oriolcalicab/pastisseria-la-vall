import { useState } from 'react'
import { heroImage } from '../data/heroImage'

const HeroImage = () => {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <>
      <img
        src={heroImage.src}
        alt={heroImage.alt}
        fetchPriority="high"
        className={`absolute top-[-4%] left-[-4%] -z-20 h-[108%] w-[108%] origin-[62%_55%] object-cover object-[62%_center] brightness-[.56] saturate-[.92] motion-safe:animate-ken-burns md:object-[60%_56%] md:brightness-[.69] md:saturate-[.9] ${
          isPaused ? '[animation-play-state:paused]' : ''
        }`}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(16,13,12,.9),rgba(16,13,12,.55)_46%,rgba(16,13,12,.05)_100%)] md:bg-[linear-gradient(90deg,rgba(16,13,12,.88)_0%,rgba(16,13,12,.68)_34%,rgba(16,13,12,.12)_76%),linear-gradient(0deg,rgba(16,13,12,.42),transparent_40%)]"
      />

      <p className="absolute right-6 bottom-6 hidden text-xs tracking-[0.16em] text-cream/75 uppercase md:block md:right-8">
        Fet a mà · Per compartir
      </p>

      <button
        type="button"
        onClick={() => setIsPaused((current) => !current)}
        className="absolute bottom-6 left-6 rounded-full border border-cream/40 px-3 py-1.5 text-xs text-cream/85 hover:bg-cream/10 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none motion-reduce:hidden md:left-8"
      >
        {isPaused ? "Reprodueix l'animació" : "Atura l'animació"}
      </button>
    </>
  )
}

export default HeroImage
