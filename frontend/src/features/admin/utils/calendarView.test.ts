import { describe, expect, it } from 'vitest'
import { initialCalendarView } from './calendarView'

describe('initialCalendarView', () => {
  it('opens the month on a computer or a tablet', () => {
    expect(initialCalendarView(1280)).toBe('dayGridMonth')
    expect(initialCalendarView(768)).toBe('dayGridMonth')
  })

  it('opens the list of the week on a phone', () => {
    expect(initialCalendarView(390)).toBe('listWeek')
  })
})
