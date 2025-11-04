import { CalendarEvent } from '@/components/Calendar/CalendarView.types';
import { isWithinInterval, startOfDay, endOfDay } from 'date-fns';

/**
 * Filters events for a specific date
 */
export const getEventsForDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter((event) => {
    const eventStart = startOfDay(event.startDate);
    const eventEnd = endOfDay(event.endDate);
    const targetDate = startOfDay(date);

    return isWithinInterval(targetDate, { start: eventStart, end: eventEnd });
  });
};

/**
 * Sorts events by start date
 */
export const sortEventsByStartDate = (events: CalendarEvent[]): CalendarEvent[] => {
  return [...events].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
};

/**
 * Checks if events overlap
 */
export const doEventsOverlap = (event1: CalendarEvent, event2: CalendarEvent): boolean => {
  return (
    event1.startDate < event2.endDate && event1.endDate > event2.startDate
  );
};

/**
 * Groups overlapping events for week view positioning
 */
export const groupOverlappingEvents = (events: CalendarEvent[]): CalendarEvent[][] => {
  if (events.length === 0) return [];

  const sorted = sortEventsByStartDate(events);
  const groups: CalendarEvent[][] = [];
  let currentGroup: CalendarEvent[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const currentEvent = sorted[i];
    const hasOverlap = currentGroup.some((event) => doEventsOverlap(event, currentEvent));

    if (hasOverlap) {
      currentGroup.push(currentEvent);
    } else {
      groups.push(currentGroup);
      currentGroup = [currentEvent];
    }
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
};

/**
 * Generates a unique event ID
 */
export const generateEventId = (): string => {
  return `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validates event data
 */
export const validateEvent = (event: Partial<CalendarEvent>): string[] => {
  const errors: string[] = [];

  if (!event.title || event.title.trim() === '') {
    errors.push('Title is required');
  }

  if (event.title && event.title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }

  if (event.description && event.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }

  if (!event.startDate) {
    errors.push('Start date is required');
  }

  if (!event.endDate) {
    errors.push('End date is required');
  }

  if (event.startDate && event.endDate && event.startDate >= event.endDate) {
    errors.push('End date must be after start date');
  }

  return errors;
};

/**
 * Default event colors
 */
export const EVENT_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Yellow', value: '#f59e0b' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Teal', value: '#14b8a6' },
];

/**
 * Default event categories
 */
export const EVENT_CATEGORIES = [
  'Meeting',
  'Work',
  'Personal',
  'Design',
  'Development',
  'Other',
];

/**
 * Gets a random color from the default palette
 */
export const getRandomColor = (): string => {
  return EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)].value;
};

/**
 * Filters events by category
 */
export const filterEventsByCategory = (
  events: CalendarEvent[],
  category: string
): CalendarEvent[] => {
  return events.filter((event) => event.category === category);
};

/**
 * Searches events by title or description
 */
export const searchEvents = (events: CalendarEvent[], query: string): CalendarEvent[] => {
  const lowerQuery = query.toLowerCase();
  return events.filter(
    (event) =>
      event.title.toLowerCase().includes(lowerQuery) ||
      event.description?.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Calculates the position and height of an event in week view
 */
export const calculateEventPosition = (
  startDate: Date,
  endDate: Date,
  dayStart: Date
): { top: number; height: number } => {
  const minutesFromDayStart = Math.floor((startDate.getTime() - startOfDay(dayStart).getTime()) / (1000 * 60));
  const duration = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60));

  // Each hour is represented by 60px
  const pixelsPerHour = 60;
  const minutesPerHour = 60;

  const top = (minutesFromDayStart / minutesPerHour) * pixelsPerHour;
  const height = Math.max((duration / minutesPerHour) * pixelsPerHour, 30); // Minimum 30px

  return { top, height };
};

/**
 * Creates a sample event
 */
export const createSampleEvent = (
  title: string,
  startDate: Date,
  endDate: Date,
  color: string = '#3b82f6',
  category: string = 'Work'
): CalendarEvent => {
  return {
    id: generateEventId(),
    title,
    startDate,
    endDate,
    color,
    category,
  };
};
