const SMALL_SCREEN_WIDTH = 768

export const initialCalendarView = (screenWidth: number): string =>
  screenWidth < SMALL_SCREEN_WIDTH ? 'listWeek' : 'dayGridMonth'
