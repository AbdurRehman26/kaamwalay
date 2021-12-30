import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';
import { plainToInstance } from 'class-transformer';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { NotificationItem } from '../../classes/NotificationItem';
import { NotificationTypeEnum } from '../../constants/NotificationTypeEnum';
import { useNotifications } from '../../hooks/useNotifications';

export function NotificationsContainer() {
    const [active, setActive] = useState<NotificationItem | null>(null);
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
                return plainToInstance(NotificationItem, notifications[0] as NotificationItem);
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
                severity={active?.type === NotificationTypeEnum.Wait ? 'info' : active?.type}
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
