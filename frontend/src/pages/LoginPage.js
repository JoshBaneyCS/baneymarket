// pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function LoginPage() {
  const themePreference = useSelector((state) => state.theme.value);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      navigate('/dashboard');
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className={`max-w-md mx-auto mt-10 p-6 ${themePreference ? 'bg-white text-black' : 'bg-gray-800 text-white'} rounded shadow`}>
      <h2 className="text-2xl mb-4">Login</h2>
      <input
        className={`w-full mb-2 p-2 ${themePreference ? 'border border-gray-300' : 'border border-gray-600'} rounded`}
        placeholder="Username/Email/Phone"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <input
        className={`w-full mb-4 p-2 ${themePreference ? 'border border-gray-300' : 'border border-gray-600'} rounded`}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className={`w-full py-2 ${themePreference ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'} rounded hover:opacity-90`}
      >
        Login
      </button>
    </div>
  );
}

export default LoginPage;
