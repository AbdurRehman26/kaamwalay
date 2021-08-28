import { AxiosError } from 'axios';
import { NotificationItem } from '@shared/classes/NotificationItem';
import { NotificationType } from '@shared/constants/NotificationType';
import { Injectable } from '@shared/decorators/Injectable';
import { Log4ts } from '@shared/decorators/Log4ts';
import { Exception } from '@shared/exceptions/Exception';
import { ValidationException } from '@shared/exceptions/ValidationException';
import { LogChannel } from '@shared/lib/log';
import { dequeueNotification, enqueueNotification } from '@shared/redux/slices/notificationsSlice';
import { GlobalDispatch } from '@shared/redux/store';
import { getErrorMessage } from '../lib/api/getErrorMessage';
import { getErrorsBagArray } from '../lib/api/getErrorsBagArray';
import { isAxiosError } from '../lib/api/isAxiosError';
import { isErrorBagResponse } from '../lib/api/isErrorBagResponse';

@Injectable('NotificationsService')
export class NotificationsService {
    @Log4ts('NotificationsService')
    private static log: LogChannel;

    public static notify(type: NotificationType, message: string, title: string = '') {
        GlobalDispatch(enqueueNotification(new NotificationItem(type, message, title)));
    }

    public static error(message: string, title: string = '') {
        NotificationsService.notify(NotificationType.Error, message, title);
    }

    public static info(message: string, title: string = '') {
        NotificationsService.notify(NotificationType.Info, message, title);
    }

    public static success(message: string, title: string = '') {
        NotificationsService.notify(NotificationType.Success, message, title);
    }

    public static warning(message: string, title: string = '') {
        NotificationsService.notify(NotificationType.Warning, message, title);
    }

    public static exception(error: Error | Exception | AxiosError, title?: string) {
        this.log.error('Exception occurred!', { error });
        if (!isAxiosError(error) && !(error instanceof ValidationException)) {
            NotificationsService.error(getErrorMessage(error, 'Internal application error.'), title);
            return;
        }

        if (isErrorBagResponse(error)) {
            const errors = getErrorsBagArray(error);
            const errorTitle = errors.length > 1 ? 'Validation error.' : '';
            this.error(errors.join('\n'), title || errorTitle);
            return;
        }

        NotificationsService.error(getErrorMessage(error), title);
    }

    public static close(notification: string | NotificationItem) {
        GlobalDispatch(dequeueNotification(notification));
    }

    public error(message: string, title: string = '') {
        NotificationsService.error(message, title);
    }

    public exception(error: Error | Exception | AxiosError, title: string = '') {
        NotificationsService.exception(error, title);
    }

    public info(message: string, title: string = '') {
        NotificationsService.info(message, title);
    }

    public success(message: string, title: string = '') {
        NotificationsService.success(message, title);
    }

    public warning(message: string, title: string = '') {
        NotificationsService.warning(message, title);
    }
}
