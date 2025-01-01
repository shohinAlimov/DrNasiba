import { useState, ChangeEvent, FormEvent } from 'react';
import { FormField } from '../../ui/FormField/FormField';
import Calendar from '../Calendar/Calendar';
import { Button } from '../../ui/Button/Button';
import { TimeSlot } from '../types/type';
import { FormData } from '../types/type'

export const AppointmentForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    telephone: '',
    date: '',
    time: ''
  });

  const [showTimeSlots, setShowTimeSlots] = useState(false);

  const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '10:00', available: true },
    { time: '11:00', available: false },
    { time: '13:00', available: true },
    { time: '14:00', available: true },
    { time: '15:00', available: false },
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDateSelect = (date: string) => {
    setShowTimeSlots(true);
    setFormData({
      ...formData,
      date: date,
      time: ''
    });
  };

  const handleTimeSelect = (time: string) => {
    setFormData({
      ...formData,
      time: time
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      telephone: '',
      date: '',
      time: ''
    });
    setShowTimeSlots(false);
  };

  return (
    <div className="consultation">
      <form onSubmit={handleSubmit} className="consultation__form">
        <div className="consultation__form-wrapper">
          <h2 className="consultation__title">Консультация</h2>
          <FormField label='Имя'>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label='Фамилия'>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label='Email'>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label='Телефон'>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              required
            />
          </FormField>
          <Button
            type="submit"
            isDisabled={!formData.date || !formData.time}
            variant='primary'
            className="consultation__submit"
            title='Submit'
          />
        </div>

        <div className="consultation__form-wrapper">
          <div className="consultation__calendar">
            <Calendar onSelectDate={handleDateSelect} selectedDate={formData.date} />
          </div>
          {showTimeSlots && (
            <div className="consultation__time-slots">
              <h3 className="consultation__time-slots-title">
                Available Times for {formData.date}
              </h3>
              <div className="consultation__time-slots-grid">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => handleTimeSelect(slot.time)}
                    className={`consultation__time-slot ${!slot.available
                      ? 'consultation__time-slot--disabled'
                      : formData.time === slot.time
                        ? 'consultation__time-slot--selected'
                        : 'consultation__time-slot--available'
                      }`}
                  >
                    {slot.time}
                    {slot.available ? ' - Free' : ' - Booked'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
