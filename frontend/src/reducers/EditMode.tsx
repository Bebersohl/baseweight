import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const editModeSlice = createSlice({
  name: 'editMode',
  initialState: false,
  extraReducers: {
    'gearLists/createList': () => true,
  },
  reducers: {
    setEditMode: (state, action: PayloadAction<{ editMode: boolean, listId?: string }>) => {
      return action.payload.editMode;
    },
  },
});
