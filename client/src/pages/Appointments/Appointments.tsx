import React, { useState, useMemo, useEffect } from 'react';
import { AppointmentData, BookingFormData } from './type';

const getDushanbeDate = (): Date => {
  const nowUTC = new Date().toISOString(); // Get UTC ISO string
  const dushanbeOffset = 5 * 60 * 60 * 1000; // Dushanbe is UTC+5
  const dushanbeDate = new Date(new Date(nowUTC).getTime() + dushanbeOffset);
  return dushanbeDate;
};

const Appointments: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(getDushanbeDate());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const appointments: AppointmentData = {
    "2025-01-09": [
      { time: "8:00 - 9:00", status: "Свободно" },
      { time: "13:00 - 14:00", status: "Занято" },
    ],
    "2025-01-10": [
      { time: "10:00 - 11:00", status: "Свободно" },
      { time: "15:00 - 16:00", status: "Свободно" },
    ],
  };

  // Get today's date at midnight in Dushanbe time
  const today = useMemo(() => {
    const date = getDushanbeDate();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  // Get the maximum selectable date (20 days from today)
  const maxDate = useMemo(() => {
    const date = getDushanbeDate();
    date.setDate(date.getDate() + 20);
    return date;
  }, []);

  // Get the next day (tomorrow) in Dushanbe time
  const nextDay = useMemo(() => {
    const date = new Date(today);
    date.setDate(date.getDate() + 1);
    return date;
  }, [today]);

  // Initialize `selectedDate` to `nextDay` if not already set
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(nextDay);
    }
  }, [nextDay, selectedDate]);

  // Automatically select the first available time slot for the selected date
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const availableSlots = appointments[formattedDate]?.filter(
        (slot) => slot.status === 'Свободно'
      );
      if (availableSlots?.length) {
        setSelectedTime(availableSlots[0].time); // Automatically select the first available slot
      } else {
        setSelectedTime(null); // No slots available
      }
    }
  }, [selectedDate, appointments]);

  // Check if a date is selectable (between today and maxDate, excluding today)
  const isDateSelectable = (date: Date): boolean => {
    return date > today && date <= maxDate;
  };

  // Format date into Russian long format with Dushanbe timezone
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Dushanbe',
    }).format(date);
  };

  // Handle date selection
  const handleDateClick = (day: number): void => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    if (isDateSelectable(newDate)) {
      setSelectedDate(newDate);
      setSelectedTime(null);
    }
  };

  // Handle time slot selection
  const handleTimeSelect = (time: string): void => {
    setSelectedTime(time);
  };

  // Handle form submission
  const handleSubmit = (): void => {
    if (selectedDate && selectedTime) {
      const formData: BookingFormData = {
        date: selectedDate,
        time: selectedTime,
      };
      console.log('Booking Form Data:', formData);
    }
  };

  // Render calendar days
  const renderCalendarDays = (): JSX.Element[] => {
    const days: JSX.Element[] = [];
    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
    const firstDay = (new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() + 6) % 7;

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar__day calendar__day--disabled" />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isSelectable = isDateSelectable(date);

      days.push(
        <button
          key={day}
          className={`calendar__day 
            ${isSelected ? 'calendar__day--selected' : ''} 
            ${!isSelectable ? 'calendar__day--disabled' : ''}`}
          onClick={() => handleDateClick(day)}
          disabled={!isSelectable}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="calendar">
      <div className="calendar__container">
        <div className="calendar__header">
          <button
            className="calendar__nav"
            onClick={() =>
              setCurrentMonth(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
              )
            }
          >
            &lt;
          </button>
          <h3 className="calendar__month">
            {new Intl.DateTimeFormat('ru-RU', {
              month: 'long',
              year: 'numeric',
              timeZone: 'Asia/Dushanbe',
            }).format(currentMonth)}
          </h3>
          <button
            className="calendar__nav"
            onClick={() =>
              setCurrentMonth(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
              )
            }
          >
            &gt;
          </button>
        </div>

        <div className="calendar__weekdays">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
            <div key={day} className="calendar__weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar__days">{renderCalendarDays()}</div>
      </div>

      <div className="appointment-section">
        {selectedDate && (
          <>
            <h3 className="appointment-section__date">
              {formatDate(selectedDate)}
            </h3>
            <div className="appointment-section__slots">
              {appointments[selectedDate.toISOString().split('T')[0]]?.map(
                (slot, index) => (
                  <div key={index} className="appointment-section__slot">
                    <button
                      className={`appointment-section__time-btn 
                      ${selectedTime === slot.time
                          ? 'appointment-section__time-btn--selected'
                          : ''
                        } 
                      ${slot.status === 'Занято'
                          ? 'appointment-section__time-btn--disabled'
                          : ''
                        }`}
                      onClick={() => handleTimeSelect(slot.time)}
                      disabled={slot.status === 'Занято'}
                    >
                      {slot.time}
                      <span className="appointment-section__status">
                        {slot.status}
                      </span>
                    </button>
                  </div>
                )
              )}
            </div>
            {selectedTime && (
              <button
                className="appointment-section__submit"
                onClick={handleSubmit}
              >
                Подтвердить запись
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Appointments;
