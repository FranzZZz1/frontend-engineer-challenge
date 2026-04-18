import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type SessionState } from './types';

const initialState: SessionState = {
  accessToken: null,
  userId: null,
  isAuthenticated: false,
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession(state: SessionState, action: PayloadAction<{ accessToken: string; userId: string }>) {
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
    },
    setAccessToken(state: SessionState, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
    clearSession(state: SessionState) {
      state.accessToken = null;
      state.userId = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setSession, setAccessToken, clearSession } = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;
