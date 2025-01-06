import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AccountPage: React.FC = () => {
  const { token, logout } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
  });
  const [logo, setLogo] = useState<File | null>(null); // File selected by the user
  const [logoPreview, setLogoPreview] = useState<string | null>(null); // URL for preview
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!token) {
          return;
        }

        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setFormData({
          name: response.data.name,
          surname: response.data.surname || '',
          email: response.data.email,
          phone: response.data.phone || '',
        });
        setLogoPreview(`http://localhost:5000${response.data.logo}`); // Set existing logo preview
      } catch (err: any) {
        console.error(err.response?.data?.message || 'Failed to fetch user details.');
      }
    };

    fetchUserDetails();
  }, [token]);

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
      setLogo(file); // Set the selected file
      setLogoPreview(URL.createObjectURL(file)); // Generate a local preview URL
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update user details
      await axios.put(
        'http://localhost:5000/api/auth/me',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If a logo file is selected, upload it
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

      setMessage('Account updated successfully!');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to update account.');
    }
  };

  return (
    <div>
      <h1>My Account</h1>
      {user && (
        <form onSubmit={handleFormSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Surname:
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Logo:
            <input type="file" accept="image/*" onChange={handleLogoChange} />
          </label>
          {logoPreview && (
            <div>
              <p>Logo Preview:</p>
              <img src={logoPreview} alt="Logo Preview" width="100" />
            </div>
          )}
          <button type="submit">Save Changes</button>
        </form>
      )}
      {message && <p>{message}</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AccountPage;
