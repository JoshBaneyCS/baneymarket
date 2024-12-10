// src/App.js

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NavBar from './components/NavBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import LiveStocks from './pages/LiveStocks';
import StockDetail from './pages/StockDetail';
import Profile from './pages/Profile';
import './styles.css';

const App = () => {
  // Access the current theme from Redux store
  const theme = useSelector((state) => state.theme.value);
  
  // Access authentication status from Redux store
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  // Apply the theme by adding/removing the 'dark' class on the HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
        {/* Navigation Bar */}
        <NavBar />

        {/* Main Content Area */}
        <div className="container mx-auto p-4">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />}
            />
            <Route
              path="/register"
              element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />}
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/live-stocks"
              element={isAuthenticated ? <LiveStocks /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/stocks/:id"
              element={isAuthenticated ? <StockDetail /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/profile"
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />}
            />

            {/* Redirect unknown routes */}
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
