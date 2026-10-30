type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Paginació" className="mt-4 flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded border px-3 py-1 disabled:opacity-50"
      >
        « Anterior
      </button>
      <span>
        Pàgina {page} de {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded border px-3 py-1 disabled:opacity-50"
      >
        Següent »
      </button>
    </nav>
  )
}

export default Pagination