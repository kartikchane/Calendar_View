import React, { useMemo } from 'react';
import clsx from 'clsx';
import { WeekViewProps, CalendarEvent } from './CalendarView.types';
import { getWeekDays, formatTime, getShortDayName, isTodayUtil } from '@/utils/date.utils';
import { getEventsForDate, calculateEventPosition } from '@/utils/event.utils';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onDateClick,
  onEventClick,
}) => {
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const handleTimeSlotClick = (date: Date, hour: number) => {
    onDateClick(date, hour);
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick(event, e);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header with day names */}
      <div className="flex border-b border-neutral-200 bg-neutral-50 sticky top-0 z-10">
        {/* Time column header */}
        <div className="w-16 flex-shrink-0 border-r border-neutral-200" />
        
        {/* Day headers */}
        {weekDays.map((day) => {
          const isToday = isTodayUtil(day);
          
          return (
            <div
              key={day.toISOString()}
              className={clsx(
                'flex-1 px-2 py-3 text-center border-r border-neutral-200',
                isToday && 'bg-primary-50'
              )}
            >
              <div className="text-xs text-neutral-600 uppercase tracking-wide">
                {getShortDayName(day)}
              </div>
              <div
                className={clsx(
                  'text-2xl font-semibold mt-1',
                  isToday ? 'text-primary-600' : 'text-neutral-900'
                )}
              >
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="relative">
          {/* Time labels and grid */}
          {HOURS.map((hour) => (
            <div key={hour} className="flex" style={{ height: '60px' }}>
              {/* Time label */}
              <div className="w-16 flex-shrink-0 px-2 py-1 text-xs text-neutral-600 text-right border-r border-neutral-200">
                {formatTime(new Date(2000, 0, 1, hour, 0))}
              </div>

              {/* Day columns */}
              {weekDays.map((day) => (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className={clsx(
                    'flex-1 border-r border-b border-neutral-200',
                    'hover:bg-neutral-50 cursor-pointer transition-colors'
                  )}
                  onClick={() => handleTimeSlotClick(day, hour)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${getShortDayName(day)} at ${formatTime(
                    new Date(2000, 0, 1, hour, 0)
                  )}`}
                />
              ))}
            </div>
          ))}

          {/* Events overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="flex h-full">
              <div className="w-16 flex-shrink-0" />
              
              {weekDays.map((day) => {
                const dayEvents = getEventsForDate(events, day);
                
                return (
                  <div
                    key={day.toISOString()}
                    className="flex-1 relative"
                    style={{ height: `${HOURS.length * 60}px` }}
                  >
                    {dayEvents.map((event) => {
                      const { top, height } = calculateEventPosition(
                        event.startDate,
                        event.endDate,
                        day
                      );

                      return (
                        <button
                          key={event.id}
                          className={clsx(
                            'absolute left-1 right-1 px-2 py-1',
                            'text-xs text-white rounded shadow-sm',
                            'hover:shadow-md transition-shadow',
                            'pointer-events-auto',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2',
                            'overflow-hidden'
                          )}
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                            backgroundColor: event.color || '#3b82f6',
                            zIndex: 1,
                          }}
                          onClick={(e) => handleEventClick(event, e)}
                          aria-label={`Event: ${event.title} at ${formatTime(event.startDate)}`}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="text-xs opacity-90 truncate">
                            {formatTime(event.startDate)} - {formatTime(event.endDate)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
