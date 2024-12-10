// pages/StockDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StockChart from '../components/StockChart';

function StockDetail() {
  const { symbol } = useParams();
  const themePreference = useSelector((state) => state.theme.value);

  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    fetch(`/stocks/${symbol}`)
      .then(res => res.json())
      .then(data => setStock(data))
      .catch(err => console.error(err));

    fetch(`/stocks/${symbol}/history?range=1m`)
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error(err));

    fetch(`/prediction/${symbol}`)
      .then(res => res.json())
      .then(data => setPrediction(data))
      .catch(err => console.error(err));
  }, [symbol]);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {stock ? (
        <div className={`p-4 ${themePreference ? 'bg-white text-black' : 'bg-gray-800 text-white'} rounded shadow`}>
          <h2 className="text-3xl mb-2">{stock.name} ({stock.symbol})</h2>
          <p className="mb-4">Current Price: {stock.last_price}</p>
          {prediction && (
            <p className="mb-4">Predicted Price: {prediction.predicted_price}</p>
          )}
          {history.length > 0 && (
            <StockChart data={history} label={`${stock.symbol} Price History`} themePreference={themePreference} />
          )}
        </div>
      ) : (
        <p>Loading stock details...</p>
      )}
    </div>
  );
}

export default StockDetail;
