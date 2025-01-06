import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add registration logic here
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </label>
        <button type="submit">Register</button>
      </form>
      <p>
        Есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
};

export default RegistrationPage;
