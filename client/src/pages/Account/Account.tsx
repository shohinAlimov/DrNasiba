import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormField } from "../../ui/FormField";
import { Button } from "../../ui/Button";
import { AccountDetails } from "./type";

const Account: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AccountDetails>({
    name: "",
    surname: "",
    phone: "",
    email: "",
    logo: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, logo: e.target.files[0] });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove the token
    navigate("/login"); // Redirect to login
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <section className="account">
      <div className="container">
        <h2 className="account__title">Мой аккаунт</h2>
        <form className="form" onSubmit={handleSubmit}>
          <FormField label="Имя">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </FormField>
          <FormField label="Фамилия">
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              required
            />
          </FormField>
          <FormField label="Телефон">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </FormField>
          <FormField label="Email">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FormField>
          <FormField label="Логотип">
            <input
              type="file"
              name="logo"
              onChange={handleFileChange}
            />
          </FormField>
          <Button type="submit" title="Сохранить" variant="primary" />
        </form>
        <Button type="button" title="Выйти" variant="secondary" onClick={handleLogout} />
      </div>
    </section>
  );
};

export default Account;
