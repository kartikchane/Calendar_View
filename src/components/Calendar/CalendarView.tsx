import React, { useState, useCallback } from 'react';
import { CalendarViewProps, CalendarEvent } from './CalendarView.types';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { EventModal } from './EventModal';
import { Button } from '@/components/primitives/Button';
import { useCalendar } from '@/hooks/useCalendar';
import { getMonthName } from '@/utils/date.utils';

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  initialView = 'month',
  initialDate,
}) => {
  const {
    currentDate,
    view,
    selectedDate,
    setSelectedDate,
    goToNext,
    goToPrevious,
    goToToday,
    toggleView,
  } = useCalendar(initialDate, initialView);

  // Debug: Log when view changes
  React.useEffect(() => {
    console.log('Current view:', view);
  }, [view]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(undefined);
  const [modalInitialDate, setModalInitialDate] = useState<Date | undefined>(undefined);

  const handleDateClick = useCallback(
    (date: Date, hour?: number) => {
      setSelectedDate(date);
      
      const eventDate = new Date(date);
      if (hour !== undefined) {
        eventDate.setHours(hour, 0, 0, 0);
      }
      
      setModalInitialDate(eventDate);
      setEditingEvent(undefined);
      setIsModalOpen(true);
    },
    [setSelectedDate]
  );

  const handleEventClick = useCallback((event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEvent(event);
    setModalInitialDate(undefined);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingEvent(undefined);
    setModalInitialDate(undefined);
  }, []);

  const handleEventSave = useCallback(
    (event: CalendarEvent) => {
      if (editingEvent) {
        onEventUpdate(event.id, event);
      } else {
        onEventAdd(event);
      }
      handleModalClose();
    },
    [editingEvent, onEventAdd, onEventUpdate, handleModalClose]
  );

  const handleEventDelete = useCallback(
    (id: string) => {
      onEventDelete(id);
      handleModalClose();
    },
    [onEventDelete, handleModalClose]
  );

  const handleKeyNavigation = useCallback(
    (e: KeyboardEvent) => {
      // Global keyboard shortcuts
      if (e.target !== document.body) return;

      switch (e.key) {
        case 't':
        case 'T':
          goToToday();
          break;
        case 'n':
        case 'N':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setModalInitialDate(new Date());
            setEditingEvent(undefined);
            setIsModalOpen(true);
          }
          break;
        case 'v':
        case 'V':
          toggleView();
          break;
      }
    },
    [goToToday, toggleView]
  );

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyNavigation);
    return () => {
      document.removeEventListener('keydown', handleKeyNavigation);
    };
  }, [handleKeyNavigation]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Title and navigation */}
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-neutral-900">
              {getMonthName(currentDate)}
            </h1>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevious}
                aria-label={view === 'month' ? 'Previous month' : 'Previous week'}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={goToNext}
                aria-label={view === 'month' ? 'Next month' : 'Next week'}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={goToToday}>
              Today
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                console.log('Toggle button clicked! Current view:', view);
                toggleView();
              }}
              aria-label={`Switch to ${view === 'month' ? 'week' : 'month'} view`}
            >
              {view === 'month' ? 'Week' : 'Month'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setModalInitialDate(new Date());
                setEditingEvent(undefined);
                setIsModalOpen(true);
              }}
              aria-label="Create new event"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Event
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="flex-1 overflow-hidden">
        {view === 'month' ? (
          <MonthView
            currentDate={currentDate}
            events={events}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        ) : (
          <WeekView
            currentDate={currentDate}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        )}
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
        event={editingEvent}
        initialDate={modalInitialDate}
      />

      {/* Keyboard shortcuts hint */}
      <div className="hidden lg:block border-t border-neutral-200 px-6 py-2 bg-neutral-50">
        <p className="text-xs text-neutral-600">
          <kbd className="px-1.5 py-0.5 bg-white border border-neutral-300 rounded text-xs font-mono">
            T
          </kbd>{' '}
          Today •{' '}
          <kbd className="px-1.5 py-0.5 bg-white border border-neutral-300 rounded text-xs font-mono">
            V
          </kbd>{' '}
          Toggle View •{' '}
          <kbd className="px-1.5 py-0.5 bg-white border border-neutral-300 rounded text-xs font-mono">
            Ctrl+N
          </kbd>{' '}
          New Event
        </p>
      </div>
    </div>
  );
};
