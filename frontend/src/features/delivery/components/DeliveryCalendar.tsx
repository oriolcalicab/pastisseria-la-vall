import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useDeliveryDates } from '../hooks/useDeliveryDates'
import {
  addDays,
  addMonths,
  blockReasonLabels,
  getCalendarWeeks,
  getDayLabel,
  getMonthLabel,
  getMonthOf,
} from '../utils/calendar'

type DeliveryCalendarProps = {
  initialMonth: string
  selectedDate: string | null
  onSelect: (date: string) => void
}

const weekdays = [
  { short: 'dl', long: 'dilluns' },
  { short: 'dt', long: 'dimarts' },
  { short: 'dc', long: 'dimecres' },
  { short: 'dj', long: 'dijous' },
  { short: 'dv', long: 'divendres' },
  { short: 'ds', long: 'dissabte' },
  { short: 'dg', long: 'diumenge' },
]

const keyMoves: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
}

const DeliveryCalendar = ({ initialMonth, selectedDate, onSelect }: DeliveryCalendarProps) => {
  const [month, setMonth] = useState(selectedDate ? getMonthOf(selectedDate) : initialMonth)
  const [focusedDate, setFocusedDate] = useState(selectedDate ?? `${month}-01`)
  const deliveryDates = useDeliveryDates(month)
  const gridRef = useRef<HTMLTableElement>(null)
  const shouldFocus = useRef(false)

  useEffect(() => {
    if (!shouldFocus.current) return

    const button = gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focusedDate}"]`)

    if (button) {
      button.focus()
      shouldFocus.current = false
    }
  })

  const days = deliveryDates.status === 'success' ? deliveryDates.days : []
  const daysByDate = new Map(days.map((day) => [day.date, day]))

  const goToMonth = (newMonth: string) => {
    setMonth(newMonth)
    setFocusedDate(`${newMonth}-01`)
  }

  const handleSelect = (date: string) => {
    setFocusedDate(date)

    if (daysByDate.get(date)?.available) onSelect(date)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    const move = keyMoves[event.key]

    if (move === undefined) return

    event.preventDefault()

    const newDate = addDays(focusedDate, move)
    shouldFocus.current = true
    setFocusedDate(newDate)

    if (getMonthOf(newDate) !== month) setMonth(getMonthOf(newDate))
  }

  return (
    <div className="max-w-md">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => goToMonth(addMonths(month, -1))}
          disabled={month <= initialMonth}
          className="btn btn-outline btn-sm"
        >
          « Anterior
        </button>
        <h2 id="calendar-title" className="font-display text-2xl capitalize">
          {getMonthLabel(month)}
        </h2>
        <button
          type="button"
          onClick={() => goToMonth(addMonths(month, 1))}
          className="btn btn-outline btn-sm"
        >
          Següent »
        </button>
      </div>

      {deliveryDates.status === 'loading' && (
        <p role="status" className="mt-4 text-mocha">
          Carregant les dates...
        </p>
      )}

      {deliveryDates.status === 'error' && (
        <div role="alert" className="mt-4">
          <p className="text-red-700">No s'han pogut carregar les dates.</p>
          <button
            type="button"
            onClick={deliveryDates.retry}
            className="btn btn-outline btn-sm mt-3"
          >
            Torna-ho a provar
          </button>
        </div>
      )}

      {deliveryDates.status === 'success' && (
        <table
          ref={gridRef}
          aria-labelledby="calendar-title"
          onKeyDown={handleKeyDown}
          className="mt-4 w-full table-fixed"
        >
          <thead>
            <tr>
              {weekdays.map((weekday) => (
                <th key={weekday.short} scope="col" className="pb-2 text-sm font-medium text-mocha">
                  <abbr title={weekday.long} className="no-underline">
                    {weekday.short}
                  </abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getCalendarWeeks(month).map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((date, dayIndex) => {
                  if (!date) return <td key={dayIndex} />

                  const day = daysByDate.get(date)
                  const isAvailable = day?.available ?? false
                  const isSelected = date === selectedDate
                  const reason = day?.reason ? blockReasonLabels[day.reason] : 'no disponible'

                  return (
                    <td key={date} className="p-0.5">
                      <button
                        type="button"
                        data-date={date}
                        tabIndex={date === focusedDate ? 0 : -1}
                        onClick={() => handleSelect(date)}
                        aria-disabled={!isAvailable}
                        aria-pressed={isSelected}
                        aria-label={
                          isAvailable ? getDayLabel(date) : `${getDayLabel(date)}, ${reason}`
                        }
                        className={`h-11 w-full rounded-full text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caramel ${
                          isSelected
                            ? 'bg-cocoa font-medium text-white'
                            : isAvailable
                              ? 'hover:bg-nata'
                              : 'cursor-not-allowed text-mocha line-through'
                        }`}
                      >
                        {Number(date.slice(8))}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedDate && (
        <p aria-live="polite" className="mt-4 font-medium">
          Data triada: {getDayLabel(selectedDate)}
        </p>
      )}
    </div>
  )
}

export default DeliveryCalendar
