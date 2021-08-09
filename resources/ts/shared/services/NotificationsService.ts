import { NotificationItem } from '@shared/classes/NotificationItem';
import { NotificationType } from '@shared/constants/NotificationType';
import { Injectable } from '@shared/decorators/Injectable';
import { enqueueNotification } from '@shared/redux/slices/notificationsSlice';
import { GlobalDispatch } from '@shared/redux/store';

@Injectable()
export class NotificationsService {
    private static notify(type: NotificationType, message: string, title: string = '') {
        GlobalDispatch(enqueueNotification(new NotificationItem(type, message, title)));
    }

    public error(message: string, title: string = '') {
        NotificationsService.error(message, title);
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
}
