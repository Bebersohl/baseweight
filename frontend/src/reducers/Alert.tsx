import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Alert, Severity } from '../types';

const initialState: Alert = {
  severity: 'error',
  message: '',
};

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  extraReducers: {
    'user/mergeUser': () => ({
      severity: 'success' as Severity,
      message: 'Profile updated',
    }),
    'user/userAlert': (state, action) => ({ ...state, ...action.payload }),
  },
  reducers: {
    setAlert: (state, action: PayloadAction<Alert>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});
