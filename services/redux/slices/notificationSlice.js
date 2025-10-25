import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    unreadCounts: 0,
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload || [];
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCounts += 1;
    },
    markNotificationRead: (state) => {
      state.unreadCounts = 0;
    },
  },
});

export const { setNotifications, addNotification, markNotificationRead } =
  notificationSlice.actions;

export default notificationSlice.reducer;
