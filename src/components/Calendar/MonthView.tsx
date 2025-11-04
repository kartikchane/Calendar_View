import React, { useMemo } from 'react';
import { MonthViewProps } from './CalendarView.types';
import { CalendarCell } from './CalendarCell';
import {
  getCalendarGrid,
  isTodayUtil,
  isSameDayUtil,
  isCurrentMonthUtil,
  getShortDayName,
} from '@/utils/date.utils';
import { getEventsForDate } from '@/utils/event.utils';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  selectedDate,
  onDateClick,
  onEventClick,
}) => {
  const calendarGrid = useMemo(() => getCalendarGrid(currentDate), [currentDate]);

  return (
    <div className="flex flex-col h-full">
      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-0 border-b border-neutral-200 bg-neutral-50">
        {WEEKDAYS.map((day, index) => {
          const sampleDate = new Date();
          sampleDate.setDate(sampleDate.getDate() - sampleDate.getDay() + index);
          const fullDayName = getShortDayName(sampleDate);
          
          return (
            <div
              key={day}
              className="px-2 py-3 text-center text-sm font-semibold text-neutral-700"
              aria-label={fullDayName}
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          );
        })}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0 flex-1 border-l border-t border-neutral-200">
        {calendarGrid.map((date) => {
          const dateKey = date.toISOString();
          const dayEvents = getEventsForDate(events, date);
          const isToday = isTodayUtil(date);
          const isSelected = selectedDate ? isSameDayUtil(date, selectedDate) : false;
          const isCurrentMonth = isCurrentMonthUtil(date, currentDate);

          return (
            <CalendarCell
              key={dateKey}
              date={date}
              events={dayEvents}
              isToday={isToday}
              isSelected={isSelected}
              isCurrentMonth={isCurrentMonth}
              onClick={onDateClick}
              onEventClick={onEventClick}
            />
          );
        })}
      </div>
    </div>
  );
};
