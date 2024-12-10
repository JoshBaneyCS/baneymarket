// pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function Dashboard() {
  const themePreference = useSelector((state) => state.theme.value);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('/user/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setUserData(data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl mb-4">Dashboard</h2>
      {userData ? (
        <div className={`p-4 ${themePreference ? 'bg-white text-black' : 'bg-gray-800 text-white'} rounded shadow`}>
          <p>Welcome, {userData.first_name} {userData.last_name}!</p>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
          <p>Theme preference: {userData.theme_preference ? 'Light' : 'Dark'}</p>
        </div>
      ) : (
        <p>Please log in to see your dashboard.</p>
      )}
    </div>
  );
}

export default Dashboard;
