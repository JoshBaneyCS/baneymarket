// src/store/stockSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStockData } from '../services/stockService';

export const getStockData = createAsyncThunk(
  'stock/getStockData',
  async (symbol, thunkAPI) => {
    try {
      const data = await fetchStockData(symbol);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.detail);
    }
  }
);

const stockSlice = createSlice({
  name: 'stock',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStockData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStockData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getStockData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default stockSlice.reducer;
