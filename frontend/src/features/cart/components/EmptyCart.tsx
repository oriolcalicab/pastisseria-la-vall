import { Link } from 'react-router-dom'
import BagIcon from '../../../components/icons/BagIcon'

const EmptyCart = () => (
  <section className="mx-auto max-w-lg py-10 text-center">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-nata text-caramel">
      <BagIcon />
    </div>
    <p className="eyebrow mt-6">Encara no has triat cap caprici</p>
    <h1 className="page-title mt-3">El carretó és buit.</h1>
    <p className="mt-3 text-mocha">
      Hi ha un pastís per a cada ocasió. O uns cupcakes per fer especial un dia qualsevol.
    </p>
    <Link to="/productes" className="btn btn-primary mt-8">
      Tornar als productes
    </Link>
  </section>
)

export default EmptyCart
