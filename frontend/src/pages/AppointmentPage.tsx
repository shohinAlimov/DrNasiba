import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type AppointmentSlot = {
  id: string; // Unique identifier
  date: string; // ISO date string
  time: string; // Time slot
  status: 'Свободно' | 'Занято'; // Status of the appointment
};


export type AppointmentData = {
  [key: string]: AppointmentSlot[];
};

export type BookingFormData = {
  date: Date;
  time: string;
};

const getDushanbeDate = (): Date => {
  const nowUTC = new Date().toISOString();
  const dushanbeOffset = 5 * 60 * 60 * 1000; // Dushanbe is UTC+5
  const dushanbeDate = new Date(new Date(nowUTC).getTime() + dushanbeOffset);
  return dushanbeDate;
};

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState<Date>(getDushanbeDate());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<AppointmentData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAppointments, setUserAppointments] = useState<AppointmentSlot[]>([]);

  const fetchUserAppointments = async () => {
    const token = getToken();
    if (!token) {
      navigate('/login'); // Redirect to login if no token
      return;
    }

    try {
      const response = await fetch('/api/appointments/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user appointments');
      }

      const data = await response.json();
      setUserAppointments(data); // Store the user's appointments in state
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      setError('Failed to fetch user appointments.');
    }
  };

  useEffect(() => {
    fetchUserAppointments();
  }, []);


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

  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  // Fetch appointments from the backend
  const fetchAppointments = async (date: Date) => {
    setLoading(true);
    setError(null);
    const formattedDate = date.toISOString().split('T')[0];

    try {
      const response = await fetch(`/api/appointments?date=${formattedDate}`);

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(prev => ({
        ...prev,
        [formattedDate]: data,
      }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  // Initialize `selectedDate` to `nextDay` if not already set
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(nextDay);
    }
  }, [nextDay, selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      fetchAppointments(selectedDate);
    }
  }, [selectedDate]);

  // Automatically select the first available time slot for the selected date
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      if (!appointments[formattedDate]) {
        fetchAppointments(selectedDate);
      }
      const availableSlots = appointments[formattedDate]?.filter(
        (slot: any) => slot.status === 'Свободно'
      );
      if (availableSlots?.length) {
        setSelectedTime(availableSlots[0].time);
      } else {
        setSelectedTime(null);
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

  // Handle form submission to book an appointment
  const handleSubmit = async (): Promise<void> => {
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time');
      return;
    }

    const token = getToken();
    if (!token) {
      navigate('/login'); // Redirect to login if no token
      return;
    }

    setLoading(true);
    setError(null);

    const formattedDate = selectedDate.toISOString().split('T')[0];

    try {
      const response = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: formattedDate,
          time: selectedTime,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login'); // Redirect if unauthorized
          return;
        }
        throw new Error('Booking failed');
      }

      const data = await response.json();
      console.log('Booking confirmed:', data);

      // Refresh appointments
      await fetchAppointments(selectedDate);

      // Reset selection
      setSelectedTime(null);

      // Show success message
      alert('Appointment booked successfully!');
    } catch (error) {
      console.error('Error booking appointment:', error);
      setError('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const deleteUserAppointment = async (appointmentId: string): Promise<void> => {
    if (!appointmentId) {
      console.error('Invalid appointment ID:', appointmentId); // Log invalid ID
      return;
    }

    try {
      const token = getToken(); // Retrieve the auth token
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }

      // Update the user appointments state
      setUserAppointments((prev) => prev.filter((appt) => appt.id !== appointmentId));
    } catch (error) {
      console.error('Error deleting appointment:', error);
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
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
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
        {loading ? (
          <p>Loading appointments...</p>
        ) : selectedDate && (
          <>
            <h3 className="appointment-section__date">
              {formatDate(selectedDate)}
            </h3>
            <div className="appointment-section__slots">
              {appointments[selectedDate.toISOString().split('T')[0]]?.map(
                (slot: any, index: number) => (
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
                disabled={loading}
              >
                {loading ? 'Подождите...' : 'Подтвердить запись'}
              </button>
            )}
          </>
        )}
      </div>

      <div className="user-appointments">
        <h3>Ваши записи</h3>
        {userAppointments.length > 0 ? (
          <ul>
            {userAppointments.map((appt, index) => {
              console.log(appt); // Debug to see if `id` exists in each appointment
              return (
                <li key={index}>
                  Дата: {formatDate(new Date(appt.date))}, Время: {appt.time}, Статус: {appt.status}
                  <button
                    onClick={() => deleteUserAppointment(appt.id)} // Call the delete function with the appointment ID
                    disabled={loading} // Disable the button while loading
                    className="delete-button"
                  >
                    Удалить
                  </button>
                </li>
              );
            })}

          </ul>
        ) : (
          <p>У вас нет записей.</p>
        )}
      </div>



    </div>
  );
};

export default Appointments;
