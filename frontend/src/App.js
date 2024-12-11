// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StockData from './components/StockData';
import Home from './components/Home';
import About from './components/About';
import './App.css'; // Import custom CSS for styling

const App = () => {
  return (
    <Router>
      <div className="App">
        {/* Header Section with Navigation */}
        <header className="App-header">
          <h1>BaneyMarket Stock Trading Platform</h1>
          <nav>
            <ul className="nav-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/stock">Stock Data</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* Main Content Area with Routed Components */}
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stock" element={<StockData />} />
            <Route path="/about" element={<About />} />
            {/* Add more routes here as your application grows */}
          </Routes>
        </main>

        {/* Footer Section */}
        <footer className="App-footer">
          <p>&copy; {new Date().getFullYear()} BaneyMarket. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
