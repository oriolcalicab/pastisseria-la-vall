import { homeSteps } from '../data/homeSteps'

const HowItWorks = () => (
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
)

export default HowItWorks
