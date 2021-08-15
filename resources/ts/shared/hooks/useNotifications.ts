import { AxiosError } from 'axios';
import { useCallback, useMemo } from 'react';
import { NotificationItem } from '@shared/classes/NotificationItem';
import { NotificationType } from '@shared/constants/NotificationType';
import { Exception } from '../exceptions/Exception';
import { NotificationsService } from '../services/NotificationsService';
import { useSharedSelector } from './useSharedDispatch';

export function useNotifications() {
    const notifications = useSharedSelector((state) => state.notifications.queue);

    const notify = useCallback((type: NotificationType, message: string, title: string = '') => {
        NotificationsService.notify(type, message, title);
    }, []);

    const close = useCallback((notification: string | NotificationItem) => {
        NotificationsService.close(notification);
    }, []);

    const info = useCallback((message: string, title: string = '') => NotificationsService.info(message, title), []);

    const success = useCallback(
        (message: string, title: string = '') => NotificationsService.success(message, title),
        [],
    );

    const warning = useCallback(
        (message: string, title: string = '') => NotificationsService.warning(message, title),
        [],
    );

    const error = useCallback((message: string, title: string = '') => NotificationsService.error(message, title), []);

    const exception = useCallback(
        (error: Error | Exception | AxiosError, title: string = '') => NotificationsService.exception(error, title),
        [],
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
