import { useState } from 'react'
import type { FormEvent } from 'react'
import { useDashboard } from '../../hooks/useDashboard'
import { rangeError } from '../../utils/dateRange'

const inputClassName =
  'mt-1 block rounded-lg border border-line bg-white px-3 py-2 text-chocolate focus-visible:ring-2 focus-visible:ring-caramel focus-visible:outline-none'

const CustomRangeForm = () => {
  const { range, applyCustomRange } = useDashboard()
  const [draft, setDraft] = useState(range)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const message = rangeError(draft)
    setError(message)

    if (!message) applyCustomRange(draft)
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Dates personalitzades" noValidate>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm text-mocha">
          Des de
          <input
            type="date"
            value={draft.from}
            onChange={(event) => setDraft({ ...draft, from: event.target.value })}
            className={inputClassName}
          />
        </label>
        <label className="text-sm text-mocha">
          Fins a
          <input
            type="date"
            value={draft.to}
            onChange={(event) => setDraft({ ...draft, to: event.target.value })}
            className={inputClassName}
          />
        </label>
        <button type="submit" className="btn btn-outline btn-sm">
          Aplica
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  )
}

export default CustomRangeForm
