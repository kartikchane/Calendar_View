import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { CalendarCellProps } from './CalendarView.types';
import { formatDate, getShortDayName } from '@/utils/date.utils';

export const CalendarCell = React.memo<CalendarCellProps>(
  ({
    date,
    events,
    isToday,
    isSelected,
    isCurrentMonth,
    onClick,
    onEventClick,
  }) => {
    const handleClick = useCallback(() => {
      onClick(date);
    }, [date, onClick]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(date);
        }
      },
      [date, onClick]
    );

    const handleEventClick = useCallback(
      (event: React.MouseEvent, calendarEvent: typeof events[0]) => {
        event.stopPropagation();
        onEventClick(calendarEvent, event);
      },
      [onEventClick]
    );

    const dayNumber = date.getDate();
    const eventCount = events.length;
    const visibleEvents = events.slice(0, 3);
    const hiddenCount = Math.max(0, eventCount - 3);

    const ariaLabel = useMemo(() => {
      const dayName = getShortDayName(date);
      const formattedDate = formatDate(date, 'PPP');
      const eventText =
        eventCount === 0
          ? 'No events'
          : eventCount === 1
          ? '1 event'
          : `${eventCount} events`;
      return `${dayName}, ${formattedDate}. ${eventText}.`;
    }, [date, eventCount]);

    return (
      <div
        className={clsx(
          'border border-neutral-200 min-h-[120px] p-2',
          'hover:bg-neutral-50 transition-colors cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset',
          isSelected && 'bg-primary-50 border-primary-300',
          !isCurrentMonth && 'bg-neutral-100/50 text-neutral-400'
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-pressed={isSelected}
      >
        <div className="flex justify-between items-start mb-1">
          {isToday ? (
            <span
              className="w-7 h-7 bg-primary-500 rounded-full text-white text-sm font-semibold flex items-center justify-center"
              aria-label="Today"
            >
              {dayNumber}
            </span>
          ) : (
            <span
              className={clsx(
                'text-sm font-medium',
                isCurrentMonth ? 'text-neutral-900' : 'text-neutral-400'
              )}
            >
              {dayNumber}
            </span>
          )}
        </div>

        <div className="space-y-1 overflow-hidden">
          {visibleEvents.map((event) => (
            <button
              key={event.id}
              className={clsx(
                'w-full text-left text-xs px-2 py-1 rounded truncate',
                'hover:opacity-80 transition-opacity',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white'
              )}
              style={{
                backgroundColor: event.color || '#3b82f6',
                color: '#ffffff',
              }}
              onClick={(e) => handleEventClick(e, event)}
              aria-label={`Event: ${event.title}`}
            >
              {event.title}
            </button>
          ))}

          {hiddenCount > 0 && (
            <button
              className="text-xs text-primary-600 hover:underline focus-visible:underline"
              onClick={handleClick}
              aria-label={`View ${hiddenCount} more events`}
            >
              +{hiddenCount} more
            </button>
          )}
        </div>
      </div>
    );
  }
);

CalendarCell.displayName = 'CalendarCell';
