// pages/RegisterPage.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

function RegisterPage() {
  const themePreference = useSelector((state) => state.theme.value);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    cell_number: '',
    password: '',
    date_of_birth: '',
    address: '',
    country: '',
    theme_preference: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleRegister = async () => {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      alert('User registered successfully. Please login.');
    } else {
      alert('Registration failed');
    }
  };

  return (
    <div className={`max-w-md mx-auto mt-10 p-6 ${themePreference ? 'bg-white text-black' : 'bg-gray-800 text-white'} rounded shadow`}>
      <h2 className="text-2xl mb-4">Register</h2>
      <input className="w-full mb-2 p-2 border rounded" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} />
      <input className="w-full mb-2 p-2 border rounded" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} />
      <input className="w-full mb-2 p-2 border rounded" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
      <input className="w-full mb-2 p-2 border rounded" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      <input className="w-full mb-2 p-2 border rounded" name="cell_number" placeholder="Cell Number" value={formData.cell_number} onChange={handleChange} />
      <input className="w-full mb-2 p-2 border rounded" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
      <input className="w-full mb-2 p-2 border rounded" name="date_of_birth" placeholder="Date of Birth (YYYY-MM-DD)" value={formData.date_of_birth} onChange={handleChange} />
      <input className="w-full mb-2 p-2 border rounded" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
      <input className="w-full mb-2 p-2 border rounded" name="country" placeholder="Country" value={formData.country} onChange={handleChange} />
      <button
        onClick={handleRegister}
        className={`w-full py-2 ${themePreference ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'} rounded hover:opacity-90`}
      >
        Register
      </button>
    </div>
  );
}

export default RegisterPage;
