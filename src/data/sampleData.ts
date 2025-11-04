import { CalendarEvent } from '@/components/Calendar/CalendarView.types';

/**
 * Sample events for testing and demonstration
 */
export const sampleEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Team Standup',
    description: 'Daily sync with the team',
    startDate: new Date(2025, 10, 15, 9, 0), // Nov 15, 2025, 9:00 AM
    endDate: new Date(2025, 10, 15, 9, 30),   // Nov 15, 2025, 9:30 AM
    color: '#3b82f6',
    category: 'Meeting',
  },
  {
    id: 'evt-2',
    title: 'Design Review',
    description: 'Review new component designs',
    startDate: new Date(2025, 10, 15, 14, 0), // Nov 15, 2025, 2:00 PM
    endDate: new Date(2025, 10, 15, 15, 30),  // Nov 15, 2025, 3:30 PM
    color: '#10b981',
    category: 'Design',
  },
  {
    id: 'evt-3',
    title: 'Client Presentation',
    startDate: new Date(2025, 10, 16, 10, 0), // Nov 16, 2025, 10:00 AM
    endDate: new Date(2025, 10, 16, 11, 30),  // Nov 16, 2025, 11:30 AM
    color: '#f59e0b',
    category: 'Meeting',
  },
  {
    id: 'evt-4',
    title: 'Development Sprint',
    description: 'Sprint planning and task assignment',
    startDate: new Date(2025, 10, 17, 9, 0),  // Nov 17, 2025, 9:00 AM
    endDate: new Date(2025, 10, 17, 17, 0),   // Nov 17, 2025, 5:00 PM
    color: '#8b5cf6',
    category: 'Work',
  },
  {
    id: 'evt-5',
    title: 'Code Review Session',
    description: 'Review PRs from the week',
    startDate: new Date(2025, 10, 18, 15, 0), // Nov 18, 2025, 3:00 PM
    endDate: new Date(2025, 10, 18, 16, 0),   // Nov 18, 2025, 4:00 PM
    color: '#3b82f6',
    category: 'Development',
  },
  {
    id: 'evt-6',
    title: 'Team Lunch',
    startDate: new Date(2025, 10, 19, 12, 0), // Nov 19, 2025, 12:00 PM
    endDate: new Date(2025, 10, 19, 13, 0),   // Nov 19, 2025, 1:00 PM
    color: '#ec4899',
    category: 'Personal',
  },
  {
    id: 'evt-7',
    title: 'Project Planning',
    description: 'Q1 2026 planning session',
    startDate: new Date(2025, 10, 20, 10, 0), // Nov 20, 2025, 10:00 AM
    endDate: new Date(2025, 10, 20, 12, 0),   // Nov 20, 2025, 12:00 PM
    color: '#6366f1',
    category: 'Meeting',
  },
  {
    id: 'evt-8',
    title: '1:1 with Manager',
    startDate: new Date(2025, 10, 22, 14, 0), // Nov 22, 2025, 2:00 PM
    endDate: new Date(2025, 10, 22, 15, 0),   // Nov 22, 2025, 3:00 PM
    color: '#14b8a6',
    category: 'Meeting',
  },
];

/**
 * Generate events for current month dynamically
 */
export const generateCurrentMonthEvents = (): CalendarEvent[] => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return [
    {
      id: 'evt-current-1',
      title: 'Team Standup',
      description: 'Daily sync with the team',
      startDate: new Date(currentYear, currentMonth, now.getDate(), 9, 0),
      endDate: new Date(currentYear, currentMonth, now.getDate(), 9, 30),
      color: '#3b82f6',
      category: 'Meeting',
    },
    {
      id: 'evt-current-2',
      title: 'Design Review',
      description: 'Review new component designs',
      startDate: new Date(currentYear, currentMonth, now.getDate(), 14, 0),
      endDate: new Date(currentYear, currentMonth, now.getDate(), 15, 30),
      color: '#10b981',
      category: 'Design',
    },
    {
      id: 'evt-current-3',
      title: 'Client Presentation',
      startDate: new Date(currentYear, currentMonth, now.getDate() + 1, 10, 0),
      endDate: new Date(currentYear, currentMonth, now.getDate() + 1, 11, 30),
      color: '#f59e0b',
      category: 'Meeting',
    },
    {
      id: 'evt-current-4',
      title: 'Development Sprint',
      description: 'Sprint planning and task assignment',
      startDate: new Date(currentYear, currentMonth, now.getDate() + 2, 9, 0),
      endDate: new Date(currentYear, currentMonth, now.getDate() + 2, 17, 0),
      color: '#8b5cf6',
      category: 'Work',
    },
  ];
};
