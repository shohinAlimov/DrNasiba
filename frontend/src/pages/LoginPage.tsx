import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FormField } from '../components/FormField';
import { Button } from '../components/Button';
import Modal from '../components/modal';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: 'success' | 'error';
    message: string;
  }>({ type: 'success', message: '' });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token } = response.data;

      if (!token) {
        setModalConfig({
          type: 'error',
          message: 'Ошибка входа: токен не получен'
        });
        setIsModalOpen(true);
        return;
      }

      login(token);
      setModalConfig({
        type: 'success',
        message: 'Добро пожаловать! Переходим в личный кабинет...'
      });
      setIsModalOpen(true);

      // Redirect after modal shows
      setTimeout(() => {
        navigate('/account');
      }, 2000);
    } catch (err: any) {
      setModalConfig({
        type: 'error',
        message: err.response?.data?.message || 'Ошибка входа'
      });
      setIsModalOpen(true);
    }
  };

  return (
    <div className="form form--auth">
      <h1 className="form__title">Вход</h1>
      <form className="form__field" onSubmit={handleLogin} noValidate>

        <FormField label='Email'>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormField>

        <FormField label='Пароль'>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormField>

        <Button variant='primary' title='Войти' type="submit" />
      </form>

      <p className="form__link">
        Нет аккаунта? <Link to="/register">Регистрация</Link>
      </p>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalConfig.type}
        message={modalConfig.message}
        autoClose={modalConfig.type === 'success'}
        autoCloseTime={2000}
      />
    </div>
  );
};

export default LoginPage;