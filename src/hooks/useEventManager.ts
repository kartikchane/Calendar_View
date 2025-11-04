import { useState, useCallback } from 'react';
import { CalendarEvent } from '@/components/Calendar/CalendarView.types';
import { generateEventId, validateEvent } from '@/utils/event.utils';

interface UseEventManagerProps {
  initialEvents?: CalendarEvent[];
  onEventAdd?: (event: CalendarEvent) => void;
  onEventUpdate?: (id: string, updates: Partial<CalendarEvent>) => void;
  onEventDelete?: (id: string) => void;
}

export const useEventManager = ({
  initialEvents = [],
  onEventAdd,
  onEventUpdate,
  onEventDelete,
}: UseEventManagerProps = {}) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const addEvent = useCallback(
    (eventData: Omit<CalendarEvent, 'id'>) => {
      const errors = validateEvent(eventData);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const newEvent: CalendarEvent = {
        ...eventData,
        id: generateEventId(),
      };

      setEvents((prev) => [...prev, newEvent]);
      onEventAdd?.(newEvent);

      return newEvent;
    },
    [onEventAdd]
  );

  const updateEvent = useCallback(
    (id: string, updates: Partial<CalendarEvent>) => {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === id ? { ...event, ...updates } : event
        )
      );
      onEventUpdate?.(id, updates);
    },
    [onEventUpdate]
  );

  const deleteEvent = useCallback(
    (id: string) => {
      setEvents((prev) => prev.filter((event) => event.id !== id));
      onEventDelete?.(id);
    },
    [onEventDelete]
  );

  const getEvent = useCallback(
    (id: string): CalendarEvent | undefined => {
      return events.find((event) => event.id === id);
    },
    [events]
  );

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEvent,
    clearEvents,
  };
};
