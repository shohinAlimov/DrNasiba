import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useAuth } from '../context/AuthContext';
import { FormField } from '../components/FormField';
import Modal from '../components/Modal';

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
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalConfig, setModalConfig] = React.useState<{
    type: 'success' | 'error';
    message: string;
  }>({ type: 'success', message: '' });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!token) {
        setModalConfig({
          type: 'error',
          message: 'Для записи создайте аккаунт!'
        });
        setIsModalOpen(true);

        // Navigate to register page after a short delay
        const timer = setTimeout(() => {
          navigate('/register');
        }, 2000);

        return () => clearTimeout(timer);
      };

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
  }, [token, navigate]);

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
    <section className='appointment'>
      <div className="container">
        <h1 className='appointment__title'>Запись на консультацию</h1>

        <form className='form__field' onSubmit={handleFormSubmit}>
          <FormField label='Имя'>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </FormField>

          <FormField label='Телефон'>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </FormField>

          <FormField label='Email'>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FormField>

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
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type={modalConfig.type}
          message={modalConfig.message}
          autoClose={modalConfig.type === 'success'}
          autoCloseTime={2000}
        />
      </div>
    </section>
  );
};

export default AppointmentPage;
