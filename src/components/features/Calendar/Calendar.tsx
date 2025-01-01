import { useState } from 'react';

interface CalendarProps {
  onSelectDate: (date: string) => void;
  selectedDate: string;
}

const russianMonths = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const russianWeekdays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

const Calendar = ({ onSelectDate, selectedDate }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Adjust to ensure Monday is the first day of the week
  const firstDayOfMonth = (() => {
    const day = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday (0) to the end of the week (6)
  })();

  const generateDays = () => {
    const days = [];
    const today = new Date();

    // Fill empty days at the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="calendar__day calendar__day--empty"
        ></div>
      );
    }

    // Fill days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const isSelected = dateString === selectedDate;
      const isPast = date < new Date(today.setHours(0, 0, 0, 0));
      const isDisabled = isPast || day > 20; // Example condition

      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && onSelectDate(dateString)}
          disabled={isDisabled}
          className={`calendar__day ${isSelected
            ? 'calendar__day--selected'
            : isDisabled
              ? 'calendar__day--disabled'
              : 'calendar__day--available'
            }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const moveMonth = (increment: number) => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + increment)));
  };

  return (
    <div className="calendar">
      <div className="calendar__header">
        <button onClick={() => moveMonth(-1)} className="btn calendar__nav-btn">
          <svg width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.71289 1.383L1.84351 9.25237L9.71289 17.1218" stroke="black" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h2 className="calendar__title">
          {russianMonths[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={() => moveMonth(1)} className="btn calendar__nav-btn">
          <svg width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.55884 17.1218L9.42822 9.25239L1.55884 1.38301" stroke="black" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="calendar__grid">
        {russianWeekdays.map((day) => (
          <div key={day} className="calendar__weekday">
            {day}
          </div>
        ))}
        {generateDays()}
      </div>
    </div>
  );
};

export default Calendar;
