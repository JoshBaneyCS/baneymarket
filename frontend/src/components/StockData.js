// src/components/StockData.js

import React, { useState } from 'react';
import { TextField, Button, CircularProgress, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
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
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '800px', margin: '20px auto' }}>
      <Typography variant="h4" gutterBottom>Stock Data</Typography>
      <TextField
        label="Stock Symbol"
        variant="outlined"
        fullWidth
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter Stock Symbol (e.g., AAPL)"
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleFetch} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Fetch Stock Data'}
      </Button>

      {error && <Typography color="error" style={{ marginTop: '10px' }}>{error}</Typography>}

      {stockInfo && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">{stockInfo['Meta Data']?.['2. Symbol']}</Typography>
          <Typography>Last Refreshed: {stockInfo['Meta Data']?.['3. Last Refreshed']}</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Open</TableCell>
                <TableCell>High</TableCell>
                <TableCell>Low</TableCell>
                <TableCell>Close</TableCell>
                <TableCell>Volume</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockInfo['Time Series (Daily)'] &&
                Object.entries(stockInfo['Time Series (Daily)']).map(([date, values]) => (
                  <TableRow key={date}>
                    <TableCell>{date}</TableCell>
                    <TableCell>{values['1. open']}</TableCell>
                    <TableCell>{values['2. high']}</TableCell>
                    <TableCell>{values['3. low']}</TableCell>
                    <TableCell>{values['4. close']}</TableCell>
                    <TableCell>{values['5. volume']}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Paper>
  );
};

export default StockData;
