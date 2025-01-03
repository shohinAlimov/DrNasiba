import React, { useEffect, useState } from "react";
import { FormField } from "../../ui/FormField";
import { Button } from "../../ui/Button";
import api, { getAccountDetails } from "../../../../backend/services/api";
import { useAuth } from "../../context/AuthContext";
import ToastNotification from "../../components/ToastNotification";
import { AccountDetails } from "./type";
import { useNavigate } from "react-router-dom";

const Account: React.FC = () => {
  const { logout, updateUser } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState<AccountDetails>({
    name: "",
    surname: "",
    phone: "",
    email: "",
    logo: null, // Initialize as null
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
  });


  const validateFields = (): boolean => {
    const newErrors: { name: string; phone: string; email: string } = {
      name: "",
      phone: "",
      email: "",
    };

    if (!formData.name || formData.name.length <= 5) {
      newErrors.name = "Заполните данное поле";
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



  useEffect(() => {
    getAccountDetails()
      .then((response) => {
        if (response.data) {
          setFormData({
            name: response.data.name || "",
            surname: response.data.surname || "",
            phone: response.data.phone || "",
            email: response.data.email || "",
            logo: null, // File cannot be fetched
          });

          if (response.data.logo) {
            setPreview(response.data.logo);
          }
        } else {
          // Initialize empty form for new users
          setFormData({
            name: "",
            surname: "",
            phone: "",
            email: "",
            logo: null,
          });
        }
      })
      .catch(() => {
        setNotification({ message: "Failed to fetch account details.", type: "error" });
      });
  }, []);



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) {
      return; // Stop submission if validation fails
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("surname", formData.surname);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("email", formData.email);
    if (formData.logo) {
      formDataToSend.append("logo", formData.logo);
    }

    api.post("/api/account", formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => {
        setNotification({ message: "Account details saved successfully!", type: "success" }); // Show success notification
        updateUser({ name: response.data.name, logo: response.data.logo });
      })
      .catch((error) => {
        console.error("Error saving account details:", error);
        setNotification({ message: "Failed to save account details.", type: "error" }); // Show error notification
      });

  };

  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear auth state
    navigate("/login"); // Redirect to login
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      // Call validateFile here
      if (!validateFile(file)) {
        return; // Stop further processing if the file is invalid
      }

      setFormData({ ...formData, logo: file });

      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };


  const validateFile = (file: File): boolean => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setNotification({ message: "Неправильный формат. Пожалуйста загрузите аватарку в формате JPG, PNG, или JPEG.", type: "error" }); // Trigger error notification
      return false;
    }

    if (file.size > maxSize) {
      setNotification({ message: "Размер файла превышает 5мб. Пожалуйста загрузите файл меньше.", type: "error" }); // Trigger error notification
      return false;
    }

    return true;
  };


  return (
    <section className="account">
      {notification && (
        <ToastNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="container">
        <div className="account__top-wrapper">
          <h2 className="account__title">Мой аккаунт</h2>
          <Button className="" type="button" title="Выйти" variant="primary" onClick={handleLogout} />
        </div>
        <form className="form" onSubmit={handleSubmit} noValidate>
          <FormField label="Имя">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <span className="form__error">{errors.name}</span>}
          </FormField>


          <FormField label="Фамилия">
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            />
            {formData.surname && formData.surname.length <= 5 && (
              <span className="form__error">Фамилия должна быть больше 5 символов.</span>
            )}
          </FormField>

          <FormField label="Телефон">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            {errors.phone && <span className="form__error">{errors.phone}</span>}
          </FormField>


          <FormField label="Email">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <span className="form__error">{errors.email}</span>}
          </FormField>


          <FormField label="Логотип">
            <div className="file-input">
              <input
                type="file"
                name="logo"
                id="file-upload"
                onChange={handleFileChange}
                className="file-input__input"
              />
              <label htmlFor="file-upload" className="file-input__label">
                <span className="file-input__icon">📁</span>
                <span className="file-input__text">Choose File</span>
              </label>
            </div>
            {preview && <img src={preview} alt="Logo Preview" className="logo-preview" />}
          </FormField>

          <Button type="submit" title="Сохранить" variant="primary" />
        </form>
      </div>
    </section>
  );
};

export default Account;
