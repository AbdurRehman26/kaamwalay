import { notificationsSlice } from '@shared/redux/slices/notificationsSlice';

export const sharedReducers = {
    notifications: notificationsSlice.reducer,
};
