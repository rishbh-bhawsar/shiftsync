import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    unreadCount: 0,
    notifications: [],
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
    },
    incrementUnread: (state) => {
      state.unreadCount += 1;
    },
  },
});

export const { setNotifications, incrementUnread } = notificationSlice.actions;
export default notificationSlice.reducer;
