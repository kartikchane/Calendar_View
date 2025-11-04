export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  color?: string;
  category?: string;
}

export interface CalendarViewProps {
  events: CalendarEvent[];
  onEventAdd: (event: CalendarEvent) => void;
  onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => void;
  onEventDelete: (id: string) => void;
  initialView?: 'month' | 'week';
  initialDate?: Date;
}

export interface CalendarCellProps {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isSelected: boolean;
  isCurrentMonth: boolean;
  onClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
}

export interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
}

export interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date, hour?: number) => void;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
}

export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (id: string) => void;
  event?: CalendarEvent;
  initialDate?: Date;
}

export interface EventFormData {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  color: string;
  category: string;
}

export type FormErrors = Partial<Record<keyof EventFormData, string>>;

export type ViewType = 'month' | 'week';

export interface CalendarState {
  currentDate: Date;
  view: ViewType;
  selectedDate: Date | null;
}
