import { AxiosError } from 'axios';
import { NotificationItem } from '../classes/NotificationItem';
import { NotificationTypeEnum } from '../constants/NotificationTypeEnum';
import { Injectable } from '../decorators/Injectable';
import { Log4ts } from '../decorators/Log4ts';
import { Exception } from '../exceptions/Exception';
import { ValidationException } from '../exceptions/ValidationException';
import { getErrorMessage } from '../lib/api/getErrorMessage';
import { getErrorsBagArray } from '../lib/api/getErrorsBagArray';
import { isAxiosError } from '../lib/api/isAxiosError';
import { isErrorBagResponse } from '../lib/api/isErrorBagResponse';
import { LogChannel } from '../lib/log';
import { dequeueNotification, enqueueNotification } from '../redux/slices/notificationsSlice';
import { GlobalDispatch } from '../redux/store';

@Injectable('NotificationsService')
export class NotificationsService {
    @Log4ts('NotificationsService')
    private static log: LogChannel;

    public static notify(type: NotificationTypeEnum, message: string, title: string = '') {
        GlobalDispatch(enqueueNotification(new NotificationItem(type, message, title)));
    }

    public static error(message: string, title: string = '') {
        NotificationsService.notify(NotificationTypeEnum.Error, message, title);
    }

    public static info(message: string, title: string = '') {
        NotificationsService.notify(NotificationTypeEnum.Info, message, title);
    }

    public static success(message: string, title: string = '') {
        NotificationsService.notify(NotificationTypeEnum.Success, message, title);
    }

    public static warning(message: string, title: string = '') {
        NotificationsService.notify(NotificationTypeEnum.Warning, message, title);
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
