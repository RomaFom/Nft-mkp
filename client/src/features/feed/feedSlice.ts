import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/store';

const initialState = {
  value: 0,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    increment: state => {
      state.value += 1;
    },
  },
});

export const { increment } = feedSlice.actions;
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectFeed = (state: RootState) => state.feed;
export default feedSlice.reducer;
