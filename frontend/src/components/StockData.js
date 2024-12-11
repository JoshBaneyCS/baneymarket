// src/components/StockData.js

import React, { useState } from 'react';
import { fetchStockData } from '../services/stockService';

const StockData = () => {
  const [symbol, setSymbol] = useState('');
  const [stockInfo, setStockInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!symbol) {
      setError('Please enter a stock symbol.');
      return;
    }

    setLoading(true);
    setError('');
    setStockInfo(null);

    try {
      const data = await fetchStockData(symbol.toUpperCase());
      setStockInfo(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stock-data-container">
      <h2>Stock Data</h2>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter Stock Symbol (e.g., AAPL)"
        className="stock-input"
      />
      <button onClick={handleFetch} className="fetch-button">
        {loading ? 'Fetching...' : 'Fetch Stock Data'}
      </button>

      {error && <p className="error-message">{error}</p>}

      {stockInfo && (
        <div className="stock-info">
          <h3>{stockInfo['Meta Data']?.['2. Symbol']}</h3>
          <p>Last Refreshed: {stockInfo['Meta Data']?.['3. Last Refreshed']}</p>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Open</th>
                <th>High</th>
                <th>Low</th>
                <th>Close</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              {stockInfo['Time Series (Daily)'] &&
                Object.entries(stockInfo['Time Series (Daily)']).map(([date, values]) => (
                  <tr key={date}>
                    <td>{date}</td>
                    <td>{values['1. open']}</td>
                    <td>{values['2. high']}</td>
                    <td>{values['3. low']}</td>
                    <td>{values['4. close']}</td>
                    <td>{values['5. volume']}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockData;
