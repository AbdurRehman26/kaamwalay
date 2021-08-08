import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { classToPlain } from 'class-transformer';

import { Notification } from '@shared/classes/Notification';

interface StateType {
    queue: Notification[];
}

export const enqueueNotification = createAsyncThunk(
    'notifications/enqueueNotification',
    async (notification: Notification) => {
        await notification.checksum();
        return classToPlain(notification);
    },
);

export const dequeueNotification = createAsyncThunk(
    'notifications/dequeueNotification',
    async (notification: string | Notification) => {
        if (typeof notification !== 'string') {
            // noinspection SuspiciousTypeOfGuard
            if (notification instanceof Notification) {
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
        [enqueueNotification.fulfilled as any]: (state, { payload }: PayloadAction<Notification>) => {
            const item = state.queue.find((item) => item.key === payload.key);
            if (!item) {
                state.queue.push(payload);
            }
        },
        [dequeueNotification.fulfilled as any]: (state, { payload }: PayloadAction<Notification>) => {
            state.queue = state.queue.filter((notification) => notification.key !== payload.key);
        },
    },
});
