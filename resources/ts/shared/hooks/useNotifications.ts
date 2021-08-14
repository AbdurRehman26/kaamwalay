import { AxiosError } from 'axios';
import { useCallback, useMemo } from 'react';

import { NotificationItem } from '@shared/classes/NotificationItem';
import { NotificationType } from '@shared/constants/NotificationType';
import { useSharedDispatch } from '@shared/hooks/useSharedSelector';

import { Exception } from '../exceptions/Exception';
import { NotificationsService } from '../services/NotificationsService';
import { useSharedSelector } from './useSharedDispatch';

export function useNotifications() {
    const notifications = useSharedSelector((state) => state.notifications.queue);
    const dispatch = useSharedDispatch();

    const notify = useCallback(
        (type: NotificationType, message: string, title: string = '') => {
            NotificationsService.notify(type, message, title);
        },
        [dispatch],
    );

    const close = useCallback(
        (notification: string | NotificationItem) => {
            NotificationsService.close(notification);
        },
        [dispatch],
    );

    const info = useCallback(
        (message: string, title: string = '') => NotificationsService.info(message, title),
        [notify],
    );

    const success = useCallback(
        (message: string, title: string = '') => NotificationsService.success(message, title),
        [notify],
    );

    const warning = useCallback(
        (message: string, title: string = '') => NotificationsService.warning(message, title),
        [notify],
    );

    const error = useCallback(
        (message: string, title: string = '') => NotificationsService.error(message, title),
        [notify],
    );

    const exception = useCallback(
        (error: Error | Exception | AxiosError, title: string = '') => NotificationsService.exception(error, title),
        [notify],
    );

    return useMemo(
        () => ({
            info,
            success,
            warning,
            error,
            exception,
            notify,
            close,
            notifications,
        }),
        [info, success, warning, error, exception, notify, close, notifications],
    );
}
