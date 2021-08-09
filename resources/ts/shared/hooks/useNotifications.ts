import { useCallback, useMemo } from 'react';

import { NotificationItem } from '@shared/classes/NotificationItem';
import { NotificationType } from '@shared/constants/NotificationType';
import { useSharedDispatch } from '@shared/hooks/useSharedSelector';
import { dequeueNotification, enqueueNotification } from '@shared/redux/slices/notificationsSlice';

import { useSharedSelector } from './useSharedDispatch';

export function useNotifications() {
    const notifications = useSharedSelector((state) => state.notifications.queue);
    const dispatch = useSharedDispatch();

    const notify = useCallback(
        (type: NotificationType, message: string, title: string = '') => {
            dispatch(enqueueNotification(new NotificationItem(type, message, title)));
        },
        [dispatch],
    );

    const close = useCallback(
        (notification: string | NotificationItem) => {
            dispatch(dequeueNotification(notification));
        },
        [dispatch],
    );

    const info = useCallback(
        (message: string, title: string = '') => notify(NotificationType.Info, message, title),
        [notify],
    );

    const success = useCallback(
        (message: string, title: string = '') => notify(NotificationType.Success, message, title),
        [notify],
    );

    const warning = useCallback(
        (message: string, title: string = '') => notify(NotificationType.Warning, message, title),
        [notify],
    );

    const error = useCallback(
        (message: string, title: string = '') => notify(NotificationType.Error, message, title),
        [notify],
    );

    return useMemo(
        () => ({
            info,
            success,
            warning,
            error,
            notify,
            close,
            notifications,
        }),
        [info, success, warning, error, notify, close, notifications],
    );
}
