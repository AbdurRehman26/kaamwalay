import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { StatusChip } from '@shared/components/StatusChip';
import { StatusProgressBar } from '@shared/components/StatusProgressBar';
import { OrderStatusEnum, OrderStatusMap } from '@shared/constants/OrderStatusEnum';
import { OrderStatusEntity } from '@shared/entities/OrderStatusEntity';
import { OrderStatusHistoryEntity } from '@shared/entities/OrderStatusHistoryEntity';
import { font } from '@shared/styles/utils';
import { useOrderStatus } from '../../../hooks/useOrderStatus';

interface SubmissionViewHeaderProps {
    orderId: string | number;
    orderNumber: string;
    orderStatus: OrderStatusEntity;
    orderStatusHistory: OrderStatusHistoryEntity[];
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
        button: {
            borderRadius: 24,
            padding: theme.spacing(1.375, 3.5),
        },
    }),
    { name: 'SubmissionViewHeader' },
);

export function SubmissionsViewHeader({
    orderId,
    orderNumber,
    orderStatus,
    orderStatusHistory,
}: SubmissionViewHeaderProps) {
    const classes = useStyles();

    const [statusType, statusLabel] = useOrderStatus(orderStatus);

    const actionButton = useMemo(() => {
        const sharedProps: any = {
            variant: 'contained',
            color: 'primary',
            size: 'large',
            className: classes.button,
        };

        if (!orderStatus) {
            return null;
        }

        if (!orderStatus.is(OrderStatusEnum.ARRIVED)) {
            return (
                <Button component={Link} to={`/submissions/${orderId}/review`} {...sharedProps}>
                    Review
                </Button>
            );
        }

        if (!orderStatus.is(OrderStatusEnum.GRADED)) {
            return (
                <Button component={Link} to={`/submissions/${orderId}/grade`} {...sharedProps}>
                    Grade
                </Button>
            );
        }

        if (!orderStatus.is(OrderStatusEnum.SHIPPED)) {
            return <Button {...sharedProps}>Mark Shipped</Button>;
        }

        return (
            <Button size={'large'} color={'primary'}>
                Edit Tracking
            </Button>
        );
    }, [classes.button, orderId, orderStatus]);

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
                    {actionButton}
                    <IconButton size={'medium'} className={classes.menuButton}>
                        <MoreVertIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <StatusProgressBar steps={history} />
        </Grid>
    );
}
