import { ValleyMark } from './Logo'

const dots = [0, 150, 300]

const PageLoader = () => (
  <div role="status" className="flex flex-col items-center justify-center gap-4 px-4 py-24">
    <svg viewBox="0 10 80 40" aria-hidden="true" className="w-20 motion-safe:animate-pulse">
      <ValleyMark />
    </svg>

    <div aria-hidden="true" className="flex gap-1.5">
      {dots.map((delay) => (
        <span
          key={delay}
          className="size-2 rounded-full bg-caramel motion-safe:animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>

    <p className="font-display text-xl text-mocha">Carregant la pàgina...</p>
  </div>
)

export default PageLoader
