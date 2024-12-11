// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import stockReducer from './stockSlice';

const store = configureStore({
  reducer: {
    stock: stockReducer,
    // Add other reducers here
  },
});

export default store;
