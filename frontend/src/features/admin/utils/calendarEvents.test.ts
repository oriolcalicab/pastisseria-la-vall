import { describe, expect, it } from 'vitest'
import type { CalendarOrder } from '../types/calendar'
import { toCalendarEvents, toRangeQuery } from './calendarEvents'

describe('calendarEvents', () => {
  it('shows each order on its delivery day with a link to the detail', () => {
    // Given a pending order
    const order: CalendarOrder = {
      id: 7,
      orderNumber: 'LV-261106-4F2A9C',
      status: 'pending',
      deliveryMethod: 'pickup',
      deliveryDate: '2026-11-12',
      user: { name: 'Anna' },
    }

    // When it is converted for the calendar
    // Then it is a whole day event with the number, the customer and the colour of its status
    expect(toCalendarEvents([order])).toEqual([
      {
        id: '7',
        title: 'LV-261106-4F2A9C · Anna',
        start: '2026-11-12',
        allDay: true,
        url: '/admin/comandes/7',
        backgroundColor: '#B45309',
        borderColor: '#B45309',
        textColor: '#FFFFFF',
      },
    ])
  })

  it('asks for the days that the calendar shows', () => {
    // Given the days of a month view, from the 26th of October to the 7th of December not included
    const start = new Date(2026, 9, 26)
    const end = new Date(2026, 11, 7)

    // When the range is created
    // Then it goes from the first day to the last one shown
    expect(toRangeQuery(start, end)).toEqual({ from: '2026-10-26', to: '2026-12-06' })
  })
})
