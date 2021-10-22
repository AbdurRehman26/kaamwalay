import MoreVertIcon from '@mui/icons-material/MoreVert';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { MouseEventHandler, useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { StatusChip } from '@shared/components/StatusChip';
import { StatusProgressBar } from '@shared/components/StatusProgressBar';
import { OrderStatusEnum, OrderStatusMap } from '@shared/constants/OrderStatusEnum';
import { OrderStatusEntity } from '@shared/entities/OrderStatusEntity';
import { OrderStatusHistoryEntity } from '@shared/entities/OrderStatusHistoryEntity';
import { ShipmentEntity } from '@shared/entities/ShipmentEntity';
import { font } from '@shared/styles/utils';
import { useOrderStatus } from '@admin/hooks/useOrderStatus';
import { SubmissionActionButton } from '../../../components/SubmissionActionButton';

interface SubmissionViewHeaderProps {
    orderId: number;
    orderNumber: string;
    orderStatus: OrderStatusEntity;
    orderStatusHistory: OrderStatusHistoryEntity[];
    orderShipment?: ShipmentEntity | null;
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
    }),
    { name: 'SubmissionViewHeader' },
);

export function SubmissionsViewHeader({
    orderId,
    orderNumber,
    orderStatus,
    orderStatusHistory,
    orderShipment,
}: SubmissionViewHeaderProps) {
    const classes = useStyles();

    const [statusType, statusLabel] = useOrderStatus(orderStatus);
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const handleClickOptions = useCallback<MouseEventHandler>((e) => setAnchorEl(e.target as Element), [setAnchorEl]);
    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);
    const routeHistory = useHistory();

    const history = useMemo(
        () =>
            [
                OrderStatusEnum.PAYMENT_PENDING,
                OrderStatusEnum.ARRIVED,
                OrderStatusEnum.GRADED,
                OrderStatusEnum.SHIPPED,
            ].map((status) => {
                const item = (orderStatusHistory ?? []).find((item) => item.orderStatusId === status);
                const { label, value } = OrderStatusMap[status];

                return {
                    label,
                    value,
                    isCompleted: !!item?.createdAt,
                    completedAt: item?.createdAt,
                };
            }),
        [orderStatusHistory],
    );

    const handleViewGrades = useCallback(() => {
        handleCloseOptions();

        routeHistory.push(`/submissions/${orderId}/grade`);
    }, [handleCloseOptions, orderId]);

    return (
        <Grid container className={classes.root}>
            <Grid container className={classes.header}>
                <Grid container item xs alignItems={'center'}>
                    <Typography variant={'h6'} className={classes.heading}>
                        Submission # <span className={font.fontWeightBold}>{orderNumber}</span>
                    </Typography>
                    <StatusChip color={statusType} label={statusLabel} />
                </Grid>
                <Grid container item xs alignItems={'center'} justifyContent={'flex-end'}>
                    <SubmissionActionButton
                        orderId={orderId}
                        orderStatus={orderStatus}
                        trackingNumber={orderShipment?.trackingNumber}
                        shippingProvider={orderShipment?.shippingProvider}
                    />
                    <IconButton size={'medium'} className={classes.menuButton}>
                        <IconButton onClick={handleClickOptions} size="large">
                            <MoreVertIcon />
                        </IconButton>

                        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseOptions}>
                            {orderStatus.is(OrderStatusEnum.GRADED) || orderStatus.is(OrderStatusEnum.SHIPPED) ? (
                                <>
                                    <MenuItem onClick={handleViewGrades}>View Grades</MenuItem>
                                </>
                            ) : null}
                        </Menu>
                    </IconButton>
                </Grid>
            </Grid>
            <StatusProgressBar steps={history} />
        </Grid>
    );
}
