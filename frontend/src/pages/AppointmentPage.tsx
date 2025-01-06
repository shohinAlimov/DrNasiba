import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useAuth } from '../context/AuthContext';

dayjs.extend(utc);
dayjs.extend(timezone);

interface Appointment {
  name: string;
  phone: string;
  email: string;
  description?: string;
  date: string;
  time: string;
}

const AppointmentPage: React.FC = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    description: '',
    date: '',
    time: '',
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { name, phone, email } = response.data;
        setFormData((prev) => ({
          ...prev,
          name,
          phone: phone || '',
          email,
        }));
      } catch (err: any) {
        console.error('Failed to fetch user details.');
      }
    };

    fetchUserDetails();
  }, [token]);

  const generateValidDates = () => {
    const today = dayjs().tz('Asia/Dushanbe');
    const dates = [];
    for (let i = 1; i <= 20; i++) {
      dates.push(today.add(i, 'day').format('YYYY-MM-DD'));
    }
    return dates;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = token
        ? 'http://localhost:5000/api/appointments/with-account' // Logged-in user
        : 'http://localhost:5000/api/appointments'; // Guest user
      const headers = token
        ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/json' };

      const response = await axios.post(url, formData, { headers });
      setAppointments([...appointments, response.data]);
      setMessage('Appointment booked successfully!');
      setFormData({
        name: '',
        phone: '',
        email: '',
        description: '',
        date: '',
        time: '',
      });
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to book appointment.');
    }
  };


  return (
    <div>
      <h1>Book an Appointment</h1>
      {!token && (
        <p>
          Если вы не хотите заполнять данные каждый раз, просим вас создать аккаунт.{' '}
          <Link to="/register">Регистрация</Link>
        </p>
      )}

      <form onSubmit={handleFormSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Description (Optional):
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Select Date:
          <select
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a date</option>
            {generateValidDates().map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </label>
        <label>
          Select Time:
          <select
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a time</option>
            {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Book Appointment</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default AppointmentPage;
