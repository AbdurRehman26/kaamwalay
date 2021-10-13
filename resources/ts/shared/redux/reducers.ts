import { notificationsSlice } from './slices/notificationsSlice';

export const sharedReducers = {
    notifications: notificationsSlice.reducer,
};
