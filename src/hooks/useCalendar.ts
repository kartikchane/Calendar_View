import { useState, useCallback } from 'react';
import { CalendarState, ViewType } from '@/components/Calendar/CalendarView.types';
import {
  goToNextMonth,
  goToPreviousMonth,
  goToNextWeek,
  goToPreviousWeek,
} from '@/utils/date.utils';

export const useCalendar = (initialDate: Date = new Date(), initialView: ViewType = 'month') => {
  const [state, setState] = useState<CalendarState>({
    currentDate: initialDate,
    view: initialView,
    selectedDate: null,
  });

  const setCurrentDate = useCallback((date: Date) => {
    setState((prev) => ({
      ...prev,
      currentDate: date,
    }));
  }, []);

  const setView = useCallback((view: ViewType) => {
    setState((prev) => ({
      ...prev,
      view,
    }));
  }, []);

  const setSelectedDate = useCallback((date: Date | null) => {
    setState((prev) => ({
      ...prev,
      selectedDate: date,
    }));
  }, []);

  const goToNext = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentDate: prev.view === 'month' 
        ? goToNextMonth(prev.currentDate)
        : goToNextWeek(prev.currentDate),
    }));
  }, []);

  const goToPrevious = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentDate: prev.view === 'month'
        ? goToPreviousMonth(prev.currentDate)
        : goToPreviousWeek(prev.currentDate),
    }));
  }, []);

  const goToToday = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentDate: new Date(),
    }));
  }, []);

  const toggleView = useCallback(() => {
    setState((prev) => {
      const newView = prev.view === 'month' ? 'week' : 'month';
      console.log('toggleView called: changing from', prev.view, 'to', newView);
      return {
        ...prev,
        view: newView,
      };
    });
  }, []);

  return {
    currentDate: state.currentDate,
    view: state.view,
    selectedDate: state.selectedDate,
    setCurrentDate,
    setView,
    setSelectedDate,
    goToNext,
    goToPrevious,
    goToToday,
    toggleView,
  };
};
