import React, { useState } from 'react';
import { loginUser } from '../api/auth';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      setToken(response.token);
      setMessage('Login successful!');
    } catch (error: any) {
      setMessage(error.response.data.message || 'Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      {message && <p>{message}</p>}
      {token && <p>Token: {token}</p>}
    </form>
  );
};

export default LoginForm;
