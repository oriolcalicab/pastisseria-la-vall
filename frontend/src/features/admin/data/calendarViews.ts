import type { CalendarFilters } from '../types/calendar'

export const calendarToolbar = {
  left: 'prev,next today',
  center: 'title',
  right: 'dayGridMonth,dayGridWeek,dayGridDay,listWeek',
}

export const MAX_EVENTS_PER_DAY = 3

export const emptyCalendarFilters: CalendarFilters = { status: '', deliveryMethod: '' }
