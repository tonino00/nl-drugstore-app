import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Notification } from '../../types/notification.types';

interface NotificationState {
  items: Notification[];
  unreadCount: number;
  loading: boolean;
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  loading: false,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload);
      if (!action.payload.read) state.unreadCount += 1;
    },
    markAsRead: (state, action: PayloadAction<number>) => {
      const notification = state.items.find((n) => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((n) => {
        if (!n.read) n.read = true;
      });
      state.unreadCount = 0;
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },
    setNotificationLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  setNotifications,
  setNotificationLoading,
} = notificationSlice.actions;
export default notificationSlice.reducer;
