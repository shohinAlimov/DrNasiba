import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormField } from '../components/FormField';
import { Button } from '../components/Button';
import Modal from '../components/modal';

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: 'success' | 'error';
    message: string;
  }>({ type: 'success', message: '' });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/auth/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setModalConfig({
        type: 'success',
        message: 'Отлично! Теперь войдите в ваш аккаунт'
      });
      setIsModalOpen(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setModalConfig({
        type: 'error',
        message: err.response?.data?.message || 'Ошибка регистрации'
      });
      setIsModalOpen(true);
    }
  };

  return (
    <div className="form">
      <h1 className="form__title">Регистрация</h1>
      <form className="form__field" onSubmit={handleRegister} noValidate>
        <FormField label='Имя'>
          <input
            type="text"
            name="name"
            value={formData.name}
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
        <FormField label='Пароль'>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </FormField>

        <Button variant='primary' type="submit" title='Зарегистрироваться' />
      </form>
      <p className="form__link">
        Есть аккаунт? <Link to="/login">Войти</Link>
      </p>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalConfig.type}
        message={modalConfig.message}
        autoClose={modalConfig.type === 'success'}
        autoCloseTime={3000}
      />
    </div>
  );
};

export default RegistrationPage;