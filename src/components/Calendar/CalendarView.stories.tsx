import type { Meta, StoryObj } from '@storybook/react';
import { CalendarView } from './CalendarView';
import { CalendarEvent } from './CalendarView.types';
import { useState } from 'react';

const meta: Meta<typeof CalendarView> = {
  title: 'Components/CalendarView',
  component: CalendarView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CalendarView>;

// Helper function to create sample events
const createEvent = (
  title: string,
  daysFromNow: number,
  startHour: number,
  duration: number,
  color: string,
  category: string
): CalendarEvent => {
  const start = new Date();
  start.setDate(start.getDate() + daysFromNow);
  start.setHours(startHour, 0, 0, 0);

  const end = new Date(start);
  end.setHours(start.getHours() + duration);

  return {
    id: `evt-${Math.random().toString(36).substr(2, 9)}`,
    title,
    startDate: start,
    endDate: end,
    color,
    category,
  };
};

// Sample events for default story
const sampleEvents: CalendarEvent[] = [
  createEvent('Team Standup', 0, 9, 0.5, '#3b82f6', 'Meeting'),
  createEvent('Design Review', 0, 14, 1.5, '#10b981', 'Design'),
  createEvent('Client Presentation', 1, 10, 1.5, '#f59e0b', 'Meeting'),
  createEvent('Development Sprint', 2, 9, 8, '#8b5cf6', 'Work'),
  createEvent('Code Review', 3, 15, 1, '#3b82f6', 'Development'),
  createEvent('Team Lunch', 4, 12, 1, '#ec4899', 'Personal'),
  createEvent('Project Planning', 5, 10, 2, '#6366f1', 'Meeting'),
  createEvent('1:1 with Manager', 7, 14, 1, '#14b8a6', 'Meeting'),
];

// Large dataset (20+ events)
const generateLargeDataset = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];
  const categories = ['Meeting', 'Work', 'Personal', 'Design', 'Development'];
  const titles = [
    'Team Meeting',
    'Project Review',
    'Client Call',
    'Design Session',
    'Code Review',
    'Planning Meeting',
    'Workshop',
    'Training',
    'Presentation',
    'Stand-up',
  ];

  for (let i = -5; i < 20; i++) {
    const eventCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < eventCount; j++) {
      events.push(
        createEvent(
          titles[Math.floor(Math.random() * titles.length)],
          i,
          9 + Math.floor(Math.random() * 8),
          Math.random() * 3 + 0.5,
          colors[Math.floor(Math.random() * colors.length)],
          categories[Math.floor(Math.random() * categories.length)]
        )
      );
    }
  }

  return events;
};

// Interactive wrapper component
const CalendarWrapper = ({ initialEvents, initialView = 'month' }: { initialEvents: CalendarEvent[], initialView?: 'month' | 'week' }) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const handleEventAdd = (event: CalendarEvent) => {
    setEvents((prev) => [...prev, event]);
  };

  const handleEventUpdate = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updates } : event))
    );
  };

  const handleEventDelete = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    <div style={{ height: '100vh' }}>
      <CalendarView
        events={events}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
        initialView={initialView}
      />
    </div>
  );
};

// Default story
export const Default: Story = {
  render: () => <CalendarWrapper initialEvents={sampleEvents} />,
  parameters: {
    docs: {
      description: {
        story: 'The default calendar view showing the current month with sample events.',
      },
    },
  },
};

// Empty state
export const Empty: Story = {
  render: () => <CalendarWrapper initialEvents={[]} />,
  parameters: {
    docs: {
      description: {
        story: 'Calendar in empty state with no events.',
      },
    },
  },
};

// Week view
export const WeekView: Story = {
  render: () => <CalendarWrapper initialEvents={sampleEvents} initialView="week" />,
  parameters: {
    docs: {
      description: {
        story: 'Week view showing time slots and events positioned by time.',
      },
    },
  },
};

// Large dataset
export const WithManyEvents: Story = {
  render: () => <CalendarWrapper initialEvents={generateLargeDataset()} />,
  parameters: {
    docs: {
      description: {
        story: 'Calendar with 20+ events demonstrating performance with large datasets.',
      },
    },
  },
};

// Interactive demo
export const InteractiveDemo: Story = {
  render: () => <CalendarWrapper initialEvents={sampleEvents} />,
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive calendar - try adding, editing, and deleting events!',
      },
    },
  },
};

// Mobile view
export const MobileView: Story = {
  render: () => <CalendarWrapper initialEvents={sampleEvents} />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Calendar optimized for mobile devices with responsive layout.',
      },
    },
  },
};

// Accessibility demonstration
export const AccessibilityDemo: Story = {
  render: () => (
    <div style={{ height: '100vh' }}>
      <div style={{ padding: '1rem', backgroundColor: '#f4f4f5', borderBottom: '1px solid #e4e4e7' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
          Keyboard Navigation
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem', lineHeight: '1.5' }}>
          <li><kbd>Tab</kbd> - Navigate between interactive elements</li>
          <li><kbd>Enter/Space</kbd> - Activate focused element</li>
          <li><kbd>Escape</kbd> - Close modal</li>
          <li><kbd>T</kbd> - Go to today</li>
          <li><kbd>V</kbd> - Toggle view (Month/Week)</li>
          <li><kbd>Ctrl+N</kbd> - Create new event</li>
        </ul>
      </div>
      <CalendarWrapper initialEvents={sampleEvents} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Calendar with full keyboard navigation support and ARIA labels.',
      },
    },
  },
};

// Tablet view
export const TabletView: Story = {
  render: () => <CalendarWrapper initialEvents={sampleEvents} />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Calendar layout optimized for tablet devices.',
      },
    },
  },
};
