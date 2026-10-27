import { useState } from 'react'
import type { FormEvent } from 'react'

type ProductSearchProps = {
  initialValue: string
  onSearch: (search: string) => void
}

const ProductSearch = ({ initialValue, onSearch }: ProductSearchProps) => {
  const [value, setValue] = useState(initialValue)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch(value.trim())
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="flex gap-2">
      <label htmlFor="product-search" className="sr-only">
        Cerca per nom
      </label>
      <input
        id="product-search"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Cerca per nom..."
        className="rounded border px-3 py-1"
      />
      <button type="submit" className="rounded border px-3 py-1">
        Cerca
      </button>
    </form>
  )
}

export default ProductSearch