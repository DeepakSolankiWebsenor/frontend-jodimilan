import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { NotificationApi } from "../../NotificationApi";

export const fetchNotifications = createAsyncThunk(
  "notification/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await NotificationApi.getNotifications();
      if (response && response.data && response.data.success) {
        return response.data.data; // Expecting { notifications: [], unreadCount: 0 }
      }
      return rejectWithValue("Failed to fetch");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markNotificationsRead = createAsyncThunk(
  "notification/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await NotificationApi.markAllRead();
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    unreadCounts: 0,
    loading: false,
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload || [];
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCounts += 1;
    },
    resetUnread: (state) => {
      state.unreadCounts = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications;
        state.unreadCounts = action.payload.unreadCount;
      })
      .addCase(markNotificationsRead.fulfilled, (state) => {
        state.unreadCounts = 0;
        // optimistic update: potentially update all items in local state to read if needed
      });
  },
});

export const { setNotifications, addNotification, resetUnread } =
  notificationSlice.actions;

export default notificationSlice.reducer;

