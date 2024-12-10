// pages/Profile.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function Profile() {
  const themePreference = useSelector((state) => state.theme.value);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({ address: '', theme_preference: true });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/user/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUserData(data);
        setFormData({ address: data.address || '', theme_preference: data.theme_preference });
      })
      .catch(err => console.error(err));
  }, []);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const response = await fetch('/user/me', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      alert('User updated successfully');
      const updatedData = await fetch('/user/me', { headers: {'Authorization': `Bearer ${token}`} }).then(r=>r.json());
      setUserData(updatedData);
    } else {
      alert('Failed to update user');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      {userData ? (
        <div className={`p-6 ${themePreference ? 'bg-white text-black' : 'bg-gray-800 text-white'} rounded shadow`}>
          <h2 className="text-2xl mb-4">Profile</h2>
          <p className="mb-2">Name: {userData.first_name} {userData.last_name}</p>
          <p className="mb-2">Username: {userData.username}</p>
          <p className="mb-2">Email: {userData.email}</p>
          <p className="mb-2">Cell Number: {userData.cell_number}</p>
          <p className="mb-2">Date of Birth: {userData.date_of_birth}</p>
          <p className="mb-2">Country: {userData.country}</p>

          <input
            className={`w-full mb-2 p-2 border rounded ${themePreference ? 'border-gray-300 bg-white text-black' : 'border-gray-600 bg-gray-700 text-white'}`}
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
          />
          <div className="flex items-center mb-4">
            <label className="mr-2">Light Mode:</label>
            <input
              type="checkbox"
              checked={formData.theme_preference}
              onChange={(e) => setFormData(prev => ({...prev, theme_preference: e.target.checked}))}
            />
          </div>
          <button 
            onClick={handleUpdate}
            className={`w-full py-2 ${themePreference ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'} rounded hover:opacity-90`}
          >
            Update Profile
          </button>
        </div>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
}

export default Profile;
