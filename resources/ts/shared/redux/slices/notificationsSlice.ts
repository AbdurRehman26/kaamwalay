import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { classToPlain } from 'class-transformer';
import { NotificationItem } from '@shared/classes/NotificationItem';

interface StateType {
    queue: NotificationItem[];
}

export const enqueueNotification = createAsyncThunk(
    'notifications/enqueueNotification',
    async (notification: NotificationItem) => {
        await notification.checksum();
        return classToPlain(notification);
    },
);

export const dequeueNotification = createAsyncThunk(
    'notifications/dequeueNotification',
    async (notification: string | NotificationItem) => {
        if (typeof notification !== 'string') {
            // noinspection SuspiciousTypeOfGuard
            if (notification instanceof NotificationItem) {
                await notification.checksum();
                return classToPlain(notification);
            }
        } else {
            return { key: notification };
        }

        return notification;
    },
);

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: {
        queue: [],
    } as StateType,
    reducers: {},
    extraReducers: {
        [enqueueNotification.fulfilled as any]: (state, { payload }: PayloadAction<NotificationItem>) => {
            const item = state.queue.find((item) => item.key === payload.key);
            if (!item) {
                state.queue.push(payload);
            }
        },
        [dequeueNotification.fulfilled as any]: (state, { payload }: PayloadAction<NotificationItem>) => {
            state.queue = state.queue.filter((notification) => notification.key !== payload.key);
        },
    },
});
