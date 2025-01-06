import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { setToken } = useAuth(); // Get the setToken function from AuthContext
  const navigate = useNavigate(); // Used to navigate to other pages

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token } = response.data;
      setToken(token); // Save the token in memory
      setMessage('Login successful!');
      navigate('/account'); // Redirect to the Account page
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
      <p>
        Нет аккаунта? <Link to="/register">Регистрация</Link>
      </p>
    </div>
  );
};

export default LoginPage;
