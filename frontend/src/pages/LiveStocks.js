// pages/LiveStocks.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function LiveStocks() {
  const themePreference = useSelector((state) => state.theme.value);
  const [stocks, setStocks] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch(`/stocks${query ? `?search=${query}` : ''}`)
      .then(res => res.json())
      .then(data => setStocks(data))
      .catch(err => console.error(err));
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl mb-4">Live Stocks</h2>
      <div className="mb-4">
        <input
          className={`p-2 w-full rounded ${themePreference ? 'border border-gray-300 bg-white text-black' : 'border border-gray-600 bg-gray-700 text-white'}`}
          placeholder="Search stocks..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <table className={`w-full text-left ${themePreference ? 'bg-white text-black' : 'bg-gray-800 text-white'} rounded shadow`}>
        <thead>
          <tr>
            <th className="p-2 border-b">Symbol</th>
            <th className="p-2 border-b">Name</th>
            <th className="p-2 border-b">Price</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(stock => (
            <tr key={stock.symbol}>
              <td className="p-2 border-b"><Link to={`/stocks/${stock.symbol}`} className="hover:underline">{stock.symbol}</Link></td>
              <td className="p-2 border-b">{stock.name}</td>
              <td className="p-2 border-b">{stock.last_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LiveStocks;
