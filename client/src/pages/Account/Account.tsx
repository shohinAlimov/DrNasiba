import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormField } from "../../ui/FormField";
import { Button } from "../../ui/Button";
import { AccountDetails } from "./type";
import { useAuth } from "../../context/AuthContext";
import api, { getAccountDetails } from "../../../../backend/services/api";

const Account: React.FC = () => {
  const navigate = useNavigate(); // For navigation after logout
  const { logout, updateUser } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<AccountDetails>({
    name: "",
    surname: "",
    phone: "",
    email: "",
    logo: null,
  });

  useEffect(() => {
    getAccountDetails()
      .then((response) => {
        if (response.data) {
          setFormData({
            name: response.data.name || "",
            surname: response.data.surname || "",
            phone: response.data.phone || "",
            email: response.data.email || "",
            logo: null,
          });

          if (response.data.logo) {
            setPreview(response.data.logo);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching account details:", error);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFormData({ ...formData, logo: file });

      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
        alert("Account details saved successfully!");
        updateUser({ name: response.data.name, logo: response.data.logo });
      })
      .catch((error) => {
        console.error("Error saving account details:", error);
        alert("Failed to save account details.");
      });
  };

  const handleLogout = () => {
    logout(); // Clear user session and context
    navigate("/login"); // Redirect to the login page
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
            <input type="file" name="logo" onChange={handleFileChange} />
            {preview && <img src={preview} alt="Logo Preview" className="logo-preview" />}
          </FormField>
          <Button type="submit" title="Сохранить" variant="primary" />
        </form>
        <Button type="button" title="Выйти" variant="secondary" onClick={handleLogout} />
      </div>
    </section>
  );
};

export default Account;
