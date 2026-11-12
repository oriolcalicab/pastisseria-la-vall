type CartNoticesProps = {
  notices: string[]
  hasFailed: boolean
}

const CartNotices = ({ notices, hasFailed }: CartNoticesProps) => (
  <>
    {notices.length > 0 && (
      <ul role="alert" className="mb-8 space-y-1 rounded-2xl bg-nata p-4 text-sm">
        {notices.map((notice) => (
          <li key={notice}>{notice}</li>
        ))}
      </ul>
    )}
    {hasFailed && (
      <p role="alert" className="mb-8 text-sm text-red-700">
        No s'ha pogut comprovar el carretó. Els preus i l'stock podrien no estar actualitzats.
      </p>
    )}
  </>
)

export default CartNotices
