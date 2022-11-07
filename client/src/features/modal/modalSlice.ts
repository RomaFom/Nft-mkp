import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/store';

const initialState = {
  show: false,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setShow: (state, action: PayloadAction<boolean>) => {
      state.show = action.payload;
    },
  },
});

export const { setShow } = modalSlice.actions;
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectModal = (state: RootState) => state.modal.show;
export default modalSlice.reducer;
