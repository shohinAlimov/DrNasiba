import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FormField } from '../components/FormField';
import { Button } from '../components/Button';
import Modal from '../components/Modal';
import { useForm } from 'react-hook-form';

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalConfig, setModalConfig] = React.useState<{
    type: 'success' | 'error';
    message: string;
  }>({ type: 'success', message: '' });

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', data);
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
      <form className="form__field" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label='Email'>
          <input
            className={`form__input ${errors.email ? 'form__input--error' : ''}`}
            type="email"
            {...register('email', {
              required: 'Email обязателен',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Неверный формат email'
              }
            })}
          />
          {errors.email && (
            <span className="form__error">{errors.email.message}</span>
          )}
        </FormField>

        <FormField label='Пароль'>
          <input
            className={`form__input ${errors.password ? 'form__input--error' : ''}`}
            type="password"
            {...register('password', {
              required: 'Пароль обязателен',
              pattern: {
                value: /^(?=.*[A-Z])(?=.*\d.*\d).{6,}$/,
                message: 'Неверный пароль'
              }
            })}
          />
          {errors.password && (
            <span className="form__error">{errors.password.message}</span>
          )}
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