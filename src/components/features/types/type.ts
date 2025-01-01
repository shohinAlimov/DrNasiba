export interface CalendarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  onDayClick: (formattedDate: string) => void;
}

export interface DialogProps {
  selectedDate: string | null;
  availableTimes: string[];
  onClose: () => void;
  onTimeSelect: (time: string) => void; // Callback for when a time is selected
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  date: string;
  time: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}