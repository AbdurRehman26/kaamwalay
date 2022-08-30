import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useMemo } from 'react';
import { StatusChip } from '@shared/components/StatusChip';
import { StatusProgressBar } from '@shared/components/StatusProgressBar';
import { SafeSquare } from '@shared/components/icons/SafeSquare';
import { AdminOrderStatusMap, OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { OrderLabelEntity } from '@shared/entities/OrderLabelEntity';
import { OrderStatusEntity } from '@shared/entities/OrderStatusEntity';
import { OrderStatusHistoryEntity } from '@shared/entities/OrderStatusHistoryEntity';
import { ShipmentEntity } from '@shared/entities/ShipmentEntity';
import { UserEntity } from '@shared/entities/UserEntity';
import { useNotifications } from '@shared/hooks/useNotifications';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { font } from '@shared/styles/utils';
import { useOrderStatus } from '@admin/hooks/useOrderStatus';
import SubmissionHeaderMoreButton from '@admin/pages/Submissions/SubmissionsView/SubmissionHeaderMoreButton';
import { SubmissionActionButton } from '../../../components/SubmissionActionButton';

interface SubmissionViewHeaderProps {
    orderId: number;
    orderNumber: string;
    orderStatus: OrderStatusEntity;
    orderStatusHistory: OrderStatusHistoryEntity[];
    orderShipment?: ShipmentEntity | null;
    orderLabel?: OrderLabelEntity | null;
    customer: UserEntity | null;
    isVault?: boolean;
    paymentStatus?: number;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            backgroundColor: '#f9f9f9',
            padding: theme.spacing(3),
        },
        header: {
            paddingBottom: theme.spacing(3),
        },
        heading: {
            fontWeight: 400,
            marginRight: theme.spacing(3),
        },
        menuButton: {
            marginLeft: theme.spacing(2),
        },
        printButton: {
            color: 'white',
            background: '#424242',
            borderRadius: 24,
            marginRight: theme.spacing(2),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            '&:hover': {
                background: '#424242',
            },
        },
        vaultButton: {
            marginLeft: theme.spacing(1.5),
            textTransform: 'capitalize',
            borderColor: '#d7d7d7',
            color: `${theme.palette.text.primary} !important`,
            height: theme.spacing(4),
        },
    }),
    { name: 'SubmissionViewHeader' },
);

export function SubmissionsViewHeader({
    orderId,
    orderNumber,
    orderStatus,
    orderStatusHistory,
    orderShipment,
    customer,
    orderLabel,
    isVault,
    paymentStatus,
}: SubmissionViewHeaderProps) {
    const classes = useStyles();
    const [statusType, statusLabel] = useOrderStatus(orderStatus, { isVault });
    const notifications = useNotifications();

    const sharedProps: any = useMemo(
        () => ({
            variant: 'contained',
            color: 'primary',
            size: 'large',
            className: classes.printButton,
        }),
        [classes.printButton],
    );

    const history = useMemo(
        () =>
            [
                OrderStatusEnum.PLACED,
                OrderStatusEnum.CONFIRMED,
                OrderStatusEnum.GRADED,
                OrderStatusEnum.ASSEMBLED,
                OrderStatusEnum.SHIPPED,
            ].map((status) => {
                const item = (orderStatusHistory ?? []).find((item) => item.orderStatusId === status);
                let { label, value } = AdminOrderStatusMap[status];

                if (status === OrderStatusEnum.SHIPPED && isVault) {
                    label = 'Stored In Vault';
                }

                return {
                    label,
                    value,
                    isCompleted: !!item?.createdAt,
                    completedAt: item?.createdAt,
                };
            }),
        [isVault, orderStatusHistory],
    );

    const DownloadOrderLabel = useCallback(async () => {
        if (!orderLabel) {
            notifications.error('Order Label is generating at the moment, try again in some minutes!');
            return;
        }

        await downloadFromUrl(orderLabel.path, `${orderNumber}_label.xlsx`);
    }, [notifications, orderLabel, orderNumber]);

    return (
        <Grid container className={classes.root}>
            <Grid container className={classes.header}>
                <Grid container item xs alignItems={'center'}>
                    <Typography variant={'h6'} className={classes.heading}>
                        Submission # <span className={font.fontWeightBold}>{orderNumber}</span>
                    </Typography>
                    <StatusChip color={statusType} label={statusLabel} />
                    {isVault ? (
                        <Button
                            disabled
                            variant={'outlined'}
                            color={'inherit'}
                            startIcon={<SafeSquare color={'primary'} />}
                            className={classes.vaultButton}
                        >
                            Vault Storage
                        </Button>
                    ) : null}
                </Grid>
                <Grid container item xs alignItems={'center'} justifyContent={'flex-end'}>
                    {orderStatus.is(OrderStatusEnum.GRADED) ||
                    orderStatus.is(OrderStatusEnum.ASSEMBLED) ||
                    orderStatus.is(OrderStatusEnum.SHIPPED) ? (
                        <Button
                            {...sharedProps}
                            startIcon={<Icon>printer</Icon>}
                            onClick={DownloadOrderLabel}
                            disabled={!orderLabel}
                        >
                            Print Stickers
                        </Button>
                    ) : null}
                    <SubmissionActionButton
                        orderId={orderId}
                        orderStatus={orderStatus}
                        trackingNumber={orderShipment?.trackingNumber}
                        shippingProvider={orderShipment?.shippingProvider}
                        inVault={isVault}
                    />
                    <SubmissionHeaderMoreButton
                        paymentStatus={paymentStatus}
                        orderId={orderId}
                        orderStatus={orderStatus}
                        customer={customer}
                    />
                </Grid>
            </Grid>
            <StatusProgressBar steps={history} />
        </Grid>
    );
}
