import type { DatesSetArg, EventClickArg } from '@fullcalendar/core'
import caLocale from '@fullcalendar/core/locales/ca'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import FullCalendar from '@fullcalendar/react'
import { useState } from 'react'
import CalendarFilters from '../../features/admin/components/calendar/CalendarFilters'
import OrderSummaryPanel from '../../features/admin/components/calendar/OrderSummaryPanel'
import StatusLegend from '../../features/admin/components/calendar/StatusLegend'
import {
  calendarToolbar,
  emptyCalendarFilters,
  MAX_EVENTS_PER_DAY,
} from '../../features/admin/data/calendarViews'
import { useCalendarOrders } from '../../features/admin/hooks/useCalendarOrders'
import type { CalendarFilters as Filters, CalendarRange } from '../../features/admin/types/calendar'
import { toCalendarEvents, toRangeQuery } from '../../features/admin/utils/calendarEvents'
import { initialCalendarView } from '../../features/admin/utils/calendarView'

const AdminCalendarPage = () => {
  const [range, setRange] = useState<CalendarRange | null>(null)
  const [filters, setFilters] = useState<Filters>(emptyCalendarFilters)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const orders = useCalendarOrders(range, filters)
  const events = orders.status === 'success' ? toCalendarEvents(orders.orders) : []

  const handleDatesSet = ({ start, end }: DatesSetArg) => {
    const next = toRangeQuery(start, end)

    setRange((current) => (current?.from === next.from && current.to === next.to ? current : next))
  }

  const handleEventClick = ({ event, jsEvent }: EventClickArg) => {
    jsEvent.preventDefault()
    setSelectedId(Number(event.id))
  }

  return (
    <>
      <p className="eyebrow">Administració</p>
      <h1 className="page-title mt-1 font-display">Calendari d'entregues</h1>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <CalendarFilters value={filters} onChange={setFilters} />
        <StatusLegend />
      </div>

      {orders.status === 'loading' && range && (
        <p role="status" className="mt-4 text-sm text-mocha">
          Carregant comandes...
        </p>
      )}

      {orders.status === 'error' && (
        <div role="alert" className="mt-4">
          <p className="text-red-700">No s'han pogut carregar les comandes del calendari.</p>
          <button type="button" onClick={orders.retry} className="btn btn-outline btn-sm mt-2">
            Torna-ho a provar
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <FullCalendar
            plugins={[dayGridPlugin, listPlugin]}
            initialView={initialCalendarView(window.innerWidth)}
            headerToolbar={calendarToolbar}
            locale={caLocale}
            firstDay={1}
            height="auto"
            dayMaxEvents={MAX_EVENTS_PER_DAY}
            events={events}
            datesSet={handleDatesSet}
            eventClick={handleEventClick}
          />
        </div>

        {selectedId !== null && (
          <OrderSummaryPanel
            key={selectedId}
            orderId={selectedId}
            onClose={() => setSelectedId(null)}
            onStatusChange={orders.retry}
          />
        )}
      </div>
    </>
  )
}

export default AdminCalendarPage
