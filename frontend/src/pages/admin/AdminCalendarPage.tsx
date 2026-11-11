import type { DatesSetArg, EventClickArg } from '@fullcalendar/core'
import caLocale from '@fullcalendar/core/locales/ca'
import dayGridPlugin from '@fullcalendar/daygrid'
import FullCalendar from '@fullcalendar/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCalendarOrders } from '../../features/admin/hooks/useCalendarOrders'
import type { CalendarRange } from '../../features/admin/types/calendar'
import { toCalendarEvents, toRangeQuery } from '../../features/admin/utils/calendarEvents'

const AdminCalendarPage = () => {
  const navigate = useNavigate()
  const [range, setRange] = useState<CalendarRange | null>(null)
  const orders = useCalendarOrders(range)
  const events = orders.status === 'success' ? toCalendarEvents(orders.orders) : []

  const handleDatesSet = ({ start, end }: DatesSetArg) => {
    const next = toRangeQuery(start, end)

    setRange((current) => (current?.from === next.from && current.to === next.to ? current : next))
  }

  const handleEventClick = ({ event, jsEvent }: EventClickArg) => {
    jsEvent.preventDefault()
    navigate(`/admin/comandes/${event.id}`)
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Calendari d'entregues</h1>

      {orders.status === 'loading' && range && (
        <p role="status" className="mt-4 text-sm text-gray-600">
          Carregant comandes...
        </p>
      )}

      {orders.status === 'error' && (
        <div role="alert" className="mt-4">
          <p className="text-red-600">No s'han pogut carregar les comandes del calendari.</p>
          <button type="button" onClick={orders.retry} className="mt-2 rounded border px-3 py-1">
            Torna-ho a provar
          </button>
        </div>
      )}

      <div className="mt-6">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale={caLocale}
          firstDay={1}
          height="auto"
          events={events}
          datesSet={handleDatesSet}
          eventClick={handleEventClick}
        />
      </div>
    </>
  )
}

export default AdminCalendarPage
