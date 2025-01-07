import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FormField } from '../components/FormField';
import { Button } from '../components/Button';
import Modal from '../components/Modal';

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
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalConfig, setModalConfig] = React.useState<{
    type: 'success' | 'error';
    message: string;
  }>({ type: 'success', message: '' });


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
    const newErrors: { name: string; surname: string; phone: string; email: string } = {
      name: "",
      surname: "",
      phone: "",
      email: "",
    };

    // Validate name
    if (!formData.name) {
      newErrors.name = "Заполните данное поле";
    } else if (formData.name.length <= 3) {
      newErrors.name = "Короткое имя!";
    }

    // Validate surname
    if (formData.surname && formData.surname.length <= 5) {
      newErrors.surname = "Фамилия короткая";
    }

    // Validate phone (must start with "+992 " and have exactly 9 digits after the space)
    const phoneWithoutPrefix = formData.phone.replace("+992 ", ""); // Remove the prefix for validation
    if (!formData.phone.startsWith("+992 ") || phoneWithoutPrefix.length !== 9 || !/^\d{9}$/.test(phoneWithoutPrefix)) {
      newErrors.phone = "Телефон должен начинаться с +992 и содержать 9 цифр.";
    }

    // Validate email
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

      setModalConfig({
        type: 'success',
        message: 'Ваши данные сохранены!'
      });
      setIsModalOpen(true);
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
      <form className="form__field" onSubmit={handleFormSubmit} >
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
            value={formData.phone} // The full value including "+992 "
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              let value = e.target.value;

              // Ensure the value always starts with "+992 " (with a space)
              if (!value.startsWith("+992 ")) {
                value = `+992 ${value.replace(/^\+992 ?/, "")}`;
              }

              // Remove any non-numeric characters after "+992 "
              value = value.replace(/^\+992\s?[^\d]*/, "+992 ").replace(/[^+\d\s]/g, "");

              setFormData((prevData) => ({
                ...prevData,
                phone: value,
              }));
            }}
            maxLength={14} // "+992 " (5 chars) + 9 digits
            required
            placeholder="+992 123456789" // Provide a clear example
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

export default AccountPage;
