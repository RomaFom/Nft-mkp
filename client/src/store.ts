import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import feed from '@/features/feed/feedSlice';
import modal from '@/features/modal/modalSlice';
import { feedApi } from '@/services/feed/feed';
export const store = configureStore({
  reducer: {
    feed: feed,
    modal: modal,
    feedApi: feedApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(feedApi.middleware),
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
