import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  signUp: false,
  signIn: false,
  profile: false,
  forgot: false,
};

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  extraReducers: {
    'user/setUser': state => initialState,
  },
  reducers: {
    toggleModal: (
      state,
      action: PayloadAction<{
        isOpen: boolean;
        modal: keyof typeof initialState;
      }>
    ) => {
      return {
        ...initialState,
        [action.payload.modal]: action.payload.isOpen,
      };
    },
  },
});
