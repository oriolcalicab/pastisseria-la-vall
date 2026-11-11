import type { EventInput } from '@fullcalendar/core'
import type { OrderStatus } from '../../orders/types/order'
import type { CalendarOrder, CalendarRange } from '../types/calendar'

const statusColors: Record<Exclude<OrderStatus, 'cancelled'>, string> = {
  pending: '#B45309',
  preparing: '#1D4ED8',
  ready: '#15803D',
  delivered: '#4B5563',
}

export const toCalendarEvents = (orders: CalendarOrder[]): EventInput[] =>
  orders.map((order) => {
    const color = order.status === 'cancelled' ? '#4B5563' : statusColors[order.status]

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
