// src/store/themeSlice.js

import { createSlice } from '@reduxjs/toolkit';

const savedTheme = localStorage.getItem('theme') || 'light';

const initialState = {
  value: savedTheme,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.value = state.value === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.value);
    },
    setTheme: (state, action) => {
      state.value = action.payload;
      localStorage.setItem('theme', state.value);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;
