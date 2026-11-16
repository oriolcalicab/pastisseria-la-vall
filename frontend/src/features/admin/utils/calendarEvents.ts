import type { EventInput } from '@fullcalendar/core'
import { statusColors } from '../data/calendarColors'
import type { CalendarOrder, CalendarRange } from '../types/calendar'

export const toCalendarEvents = (orders: CalendarOrder[]): EventInput[] =>
  orders.map((order) => {
    const color = statusColors[order.status]

    return {
      id: String(order.id),
      title: `${order.orderNumber} · ${order.user.name}`,
      start: order.deliveryDate,
      allDay: true,
      url: `/admin/comandes/${order.id}`,
      backgroundColor: color,
      borderColor: color,
      textColor: '#FFFFFF',
    }
  })

const toDateKey = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')

export const toRangeQuery = (start: Date, end: Date): CalendarRange => {
  const lastDay = new Date(end)
  lastDay.setDate(lastDay.getDate() - 1)

  return { from: toDateKey(start), to: toDateKey(lastDay) }
}
