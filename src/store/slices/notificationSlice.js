import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const fetchNotifications = createAsyncThunk("notifications/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get("/notifications");
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch notifications");
  }
});

export const markAsRead = createAsyncThunk("notifications/markRead", async (id, { rejectWithValue }) => {
  try {
    await API.put(`/notifications/${id}/read`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed");
  }
});

export const markAllAsRead = createAsyncThunk("notifications/markAllRead", async (_, { rejectWithValue }) => {
  try {
    await API.put("/notifications/read-all");
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed");
  }
});

const notificationSlice = createSlice({
  name: "notifications",
  initialState: { notifications: [], unreadCount: 0, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const n = state.notifications.find((n) => n._id === action.payload);
        if (n && !n.isRead) { n.isRead = true; state.unreadCount = Math.max(0, state.unreadCount - 1); }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => { n.isRead = true; });
        state.unreadCount = 0;
      });
  },
});

export default notificationSlice.reducer;
