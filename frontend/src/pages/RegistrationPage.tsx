import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FormField } from '../components/FormField';
import { Button } from '../components/Button';
import Modal from '../components/Modal';
import { useForm } from 'react-hook-form';

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
}

const RegistrationPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalConfig, setModalConfig] = React.useState<{
    type: 'success' | 'error';
    message: string;
  }>({ type: 'success', message: '' });

  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', data);

      setModalConfig({
        type: 'success',
        message: 'Отлично! Теперь войдите в ваш аккаунт'
      });
      setIsModalOpen(true);

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
    <div className="form form--auth">
      <h1 className="form__title">Регистрация</h1>
      <form className="form__field" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label='Имя'>
          <input
            className={`form__input ${errors.name ? 'form__input--error' : ''}`}
            type="text"
            {...register('name', {
              required: 'Имя обязательно',
              minLength: {
                value: 3,
                message: 'Имя должно содержать минимум 3 символа'
              }
            })}
          />
          {errors.name && (
            <span className="form__error">{errors.name.message}</span>
          )}
        </FormField>

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
                message: 'Пароль должен содержать минимум 6 символов, одну заглавную букву и 2 цифры'
              }
            })}
          />
          {errors.password && (
            <span className="form__error">{errors.password.message}</span>
          )}
        </FormField>

        <Button variant='primary' title='Зарегистрироваться' type="submit" />
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