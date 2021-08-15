import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { plainToClass } from 'class-transformer';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { NotificationItem } from '@shared/classes/NotificationItem';
import { NotificationType } from '@shared/constants/NotificationType';
import { useNotifications } from '@shared/hooks/useNotifications';

export function NotificationsContainer() {
    const [active, setActive] = useState<null | NotificationItem>(null);
    const { notifications, close } = useNotifications();

    const handleClose = useCallback(() => {
        setActive((previous) => {
            if (previous) {
                close(previous);
                return previous.withWait();
            }
            return null;
        });
    }, [close, setActive]);

    useEffect(() => {
        setActive((previous) => {
            if (!previous && notifications && notifications.length > 0) {
                return plainToClass(NotificationItem, notifications[0]);
            }

            return previous;
        });
    }, [active, notifications]);

    useEffect(() => {
        if (active?.wait) {
            setTimeout(() => setActive(null), 350);
        }
    }, [active?.wait]);

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={!!active && !active.wait}
            onClose={handleClose}
            autoHideDuration={3000}
            ClickAwayListenerProps={{ mouseEvent: false, touchEvent: false }}
        >
            <Alert
                onClose={handleClose}
                elevation={6}
                variant={'filled'}
                severity={active?.type === NotificationType.Wait ? 'info' : active?.type}
            >
                {active?.title ? <AlertTitle>{active.title}</AlertTitle> : null}
                {active?.message.split('\n').map((line, index) => (
                    <Fragment key={index}>
                        {line}
                        <br />
                    </Fragment>
                ))}
            </Alert>
        </Snackbar>
    );
}
