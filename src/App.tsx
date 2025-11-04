import { useState } from 'react';
import { CalendarView } from './components/Calendar/CalendarView';
import { CalendarEvent } from './components/Calendar/CalendarView.types';

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

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
    <div className="h-screen">
      <CalendarView
        events={events}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
      />
    </div>
  );
}

export default App;
