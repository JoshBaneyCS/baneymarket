// src/components/StockData.js

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStockData } from '../store/stockSlice';

const StockData = () => {
  const [symbol, setSymbol] = useState('');
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.stock);

  const handleFetch = () => {
    if (!symbol) return;
    dispatch(getStockData(symbol.toUpperCase()));
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

      {data && (
        <div className="stock-info">
          <h3>{data['Meta Data']?.['2. Symbol']}</h3>
          <p>Last Refreshed: {data['Meta Data']?.['3. Last Refreshed']}</p>
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
              {data['Time Series (Daily)'] &&
                Object.entries(data['Time Series (Daily)']).map(([date, values]) => (
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
