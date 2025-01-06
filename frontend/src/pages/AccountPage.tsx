import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FormField } from '../components/FormField';
import { Button } from '../components/Button';

const AccountPage: React.FC = () => {
  const { token, user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      if (user.logo) {
        setLogoPreview(`http://localhost:5000${user.logo}`);
      }
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
  });

  const validateFields = (): boolean => {
    const newErrors: { name: string; surname: string, phone: string; email: string } = {
      name: "",
      surname: "",
      phone: "",
      email: "",
    };

    if (!formData.name) {
      newErrors.name = "Заполните данное поле";
    }

    if (formData.name.length <= 3) {
      newErrors.name = "Короткое имя!"
    }

    if (formData.surname && formData.surname.length <= 5) {
      newErrors.surname = "Фамилия короткая"
    }

    if (!formData.phone || !/^(\+992)[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = "Телефон должен начинаться с +992 и содержать 9 цифр.";
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Введите корректный email адрес.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).every((key) => newErrors[key as keyof typeof newErrors] === "");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) {
      return; // Stop submission if validation fails
    }

    try {
      // Update user details
      await axios.put('http://localhost:5000/api/auth/me', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Upload logo if selected
      if (logo) {
        const formData = new FormData();
        formData.append('logo', logo);

        await axios.put('http://localhost:5000/api/auth/me/logo', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      console.log('Account updated successfully!');
    } catch (err: any) {
      console.log(err.response?.data?.message || 'Failed to update account.');
    }
  };



  return (
    <div className='container'>
      <div className="account__top-wrapper">
        <h1 className="account__title">Мой аккаунт</h1>
        <Button className="" type="button" title="Выйти" variant="primary" onClick={handleLogout} />
      </div>
      <form className="form" onSubmit={handleFormSubmit} >
        <FormField label="Имя">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && <span className="form__error">{errors.name}</span>}
        </FormField>
        <FormField label="Фамилия">
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleInputChange}
          />
          {errors.surname && <span className="form__error">{errors.surname}</span>}
        </FormField>

        <FormField label="Телефон">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
          {errors.phone && <span className="form__error">{errors.phone}</span>}
        </FormField>
        <FormField label="Email">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <span className="form__error">{errors.email}</span>}
        </FormField>

        <div className="form__wrap">
          {logoPreview && (
            <div>
              <img className='logo-preview' src={logoPreview} alt="Logo Preview" width="100" />
            </div>
          )}
          <FormField label="Логотип">
            <div className="file-input-wrapper">
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="file-input" // Hidden input
              />
            </div>
          </FormField>

        </div>


        <Button type="submit" title="Сохранить" variant="primary" />
      </form>
    </div>
  );
};

export default AccountPage;
