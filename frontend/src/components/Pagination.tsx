type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Paginació" className="mt-10 flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="btn btn-outline btn-sm"
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
        className="btn btn-outline btn-sm"
      >
        Següent »
      </button>
    </nav>
  )
}

export default Pagination
