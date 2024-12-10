import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';

function NavBar() {
  const dispatch = useDispatch();
  const themePreference = useSelector((state) => state.theme.value); // true = light, false = dark

  const handleToggle = () => {
    // Dispatch action to toggle theme
    dispatch(toggleTheme());
  };

  return (
    <nav className={`w-full flex items-center justify-between px-4 py-2 border-b ${themePreference ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>
      <div className="flex items-center space-x-4">
        <Link to="/" className="font-bold text-xl">Stock Trading</Link>
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/live-stocks" className="hover:underline">Live Stocks</Link>
        <Link to="/profile" className="hover:underline">Profile</Link>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={handleToggle} className="px-2 py-1 border rounded">
          {themePreference ? 'Dark Mode' : 'Light Mode'}
        </button>
        <Link to="/login" className="hover:underline">Login</Link>
      </div>
    </nav>
  );
}

export default NavBar;
