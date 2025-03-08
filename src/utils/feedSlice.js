import { createSlice } from '@reduxjs/toolkit';

const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    users: null,
    currentPage: 1,
    hasMore: true,  // To track if there are more users to fetch
  },
  reducers: {
    addFeed: (state, action) => {
      if (action.payload.page === 1) {
        state.users = action.payload.data;  // Replace feed on first page
      } else {
        state.users = [...state.users, ...action.payload.data];  // Append on next pages
      }
      state.currentPage = action.payload.page;
      state.hasMore = action.payload.data.length > 0; // No more users if data array is empty
    },
    resetFeed: (state) => {
      state.users = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
    removeFeed: (state) => {
      state.users = null;
      state.currentPage = 1;
      state.hasMore = true;
    }
  }
});

export const { addFeed, resetFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
