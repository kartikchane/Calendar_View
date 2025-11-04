import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  format,
  startOfDay,
  endOfDay,
  parseISO,
  addDays,
  differenceInMinutes,
  addHours,
} from 'date-fns';

/**
 * Calculates the number of days between two dates
 * @param start - Start date
 * @param end - End date
 * @returns Number of days (can be negative if end is before start)
 */
export const daysBetween = (start: Date, end: Date): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const startMs = startOfDay(start).getTime();
  const endMs = startOfDay(end).getTime();
  return Math.floor((endMs - startMs) / msPerDay);
};

/**
 * Checks if two dates fall on the same day (ignores time)
 */
export const isSameDayUtil = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};

/**
 * Checks if a date is today
 */
export const isTodayUtil = (date: Date): boolean => {
  return isToday(date);
};

/**
 * Checks if a date belongs to the current month
 */
export const isCurrentMonthUtil = (date: Date, currentDate: Date): boolean => {
  return isSameMonth(date, currentDate);
};

/**
 * Gets all days in a month
 */
export const getDaysInMonth = (date: Date): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

/**
 * Gets the calendar grid (42 cells for month view)
 * Includes days from previous and next months to fill the grid
 */
export const getCalendarGrid = (date: Date): Date[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  return eachDayOfInterval({ start: gridStart, end: gridEnd });
};

/**
 * Gets the week days for week view (7 days starting from the week of the given date)
 */
export const getWeekDays = (date: Date): Date[] => {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
};

/**
 * Formats a date to a readable string
 */
export const formatDate = (date: Date, formatStr: string = 'PPP'): string => {
  return format(date, formatStr);
};

/**
 * Formats time (e.g., "9:00 AM")
 */
export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

/**
 * Formats time in 24-hour format (e.g., "09:00")
 */
export const formatTime24 = (date: Date): string => {
  return format(date, 'HH:mm');
};

/**
 * Gets the month name
 */
export const getMonthName = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

/**
 * Gets the short month name
 */
export const getShortMonthName = (date: Date): string => {
  return format(date, 'MMM yyyy');
};

/**
 * Gets the day of week name
 */
export const getDayName = (date: Date): string => {
  return format(date, 'EEEE');
};

/**
 * Gets the short day of week name
 */
export const getShortDayName = (date: Date): string => {
  return format(date, 'EEE');
};

/**
 * Navigate to next month
 */
export const goToNextMonth = (date: Date): Date => {
  return addMonths(date, 1);
};

/**
 * Navigate to previous month
 */
export const goToPreviousMonth = (date: Date): Date => {
  return subMonths(date, 1);
};

/**
 * Navigate to next week
 */
export const goToNextWeek = (date: Date): Date => {
  return addWeeks(date, 1);
};

/**
 * Navigate to previous week
 */
export const goToPreviousWeek = (date: Date): Date => {
  return subWeeks(date, 1);
};

/**
 * Gets time slots for a day (used in week view)
 */
export const getTimeSlots = (): string[] => {
  const slots: string[] = [];
  let currentTime = startOfDay(new Date());

  for (let i = 0; i < 24; i++) {
    slots.push(format(addHours(currentTime, i), 'HH:mm'));
  }

  return slots;
};

/**
 * Calculates the position and height of an event in week view
 */
export const calculateEventPosition = (
  startDate: Date,
  endDate: Date,
  dayStart: Date
): { top: number; height: number } => {
  const minutesFromDayStart = differenceInMinutes(startDate, startOfDay(dayStart));
  const duration = differenceInMinutes(endDate, startDate);

  // Each hour is represented by a cell height (e.g., 60px)
  const pixelsPerHour = 60;
  const minutesPerHour = 60;

  const top = (minutesFromDayStart / minutesPerHour) * pixelsPerHour;
  const height = Math.max((duration / minutesPerHour) * pixelsPerHour, 30); // Minimum 30px

  return { top, height };
};

/**
 * Creates a date with specific time
 */
export const setDateTime = (date: Date, hours: number, minutes: number = 0): Date => {
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

/**
 * Parses a date string to Date object
 */
export const parseDateString = (dateString: string): Date => {
  return parseISO(dateString);
};

/**
 * Gets start of day
 */
export const getStartOfDay = (date: Date): Date => {
  return startOfDay(date);
};

/**
 * Gets end of day
 */
export const getEndOfDay = (date: Date): Date => {
  return endOfDay(date);
};

/**
 * Checks if a date is in the past
 */
export const isPast = (date: Date): boolean => {
  return date < new Date();
};

/**
 * Checks if a date is in the future
 */
export const isFuture = (date: Date): boolean => {
  return date > new Date();
};
