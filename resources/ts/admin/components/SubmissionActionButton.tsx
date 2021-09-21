import Button, { ButtonProps } from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ShipmentDialog from '@shared/components/ShipmentDialog/ShipmentDialog';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { OrderStatusEntity } from '@shared/entities/OrderStatusEntity';
import { ShipmentEntity } from '@shared/entities/ShipmentEntity';
import { setOrderShipment } from '@shared/redux/slices/adminOrdersSlice';
import { useAppDispatch } from '@admin/redux/hooks';

const useStyles = makeStyles(
    (theme) => ({
        button: {
            borderRadius: 24,
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
    }),
    { name: 'SubmissionActionButton' },
);

interface SubmissionActionButtonProps extends ButtonProps {
    orderId: number;
    orderStatus: OrderStatusEntity;
    shipment?: ShipmentEntity | null;
}

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: SubmissionActionButton
 * @date: 14.09.2021
 * @time: 21:43
 */
export function SubmissionActionButton({ orderId, orderStatus, shipment, ...rest }: SubmissionActionButtonProps) {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const [isShipmentDialogOpen, setIsShipmentDialogOpen] = useState(false);

    const sharedProps: any = useMemo(
        () => ({
            variant: 'contained',
            color: 'primary',
            size: 'large',
            className: classes.button,
            ...rest,
        }),
        [classes.button, rest],
    );

    const handleShipmentSubmit = useCallback(
        async ({ trackingNumber, shippingProvider }: Record<any, string>) => {
            await dispatch(setOrderShipment({ trackingNumber, shippingProvider, orderId }));
        },
        [dispatch, orderId],
    );
    const handleOpenShipmentDialog = useCallback(() => {
        setIsShipmentDialogOpen(true);
    }, []);

    const handleCloseShipmentDialog = useCallback(() => {
        setIsShipmentDialogOpen(false);
    }, []);

    if (!orderStatus || orderStatus.is(OrderStatusEnum.PLACED)) {
        return (
            <Button component={Link} to={`/submissions/${orderId}/review`} {...sharedProps}>
                Review
            </Button>
        );
    }

    if (orderStatus.is(OrderStatusEnum.ARRIVED)) {
        return (
            <Button component={Link} to={`/submissions/${orderId}/grade`} {...sharedProps}>
                Grade
            </Button>
        );
    }

    if (orderStatus.is(OrderStatusEnum.GRADED)) {
        return (
            <>
                <ShipmentDialog
                    open={isShipmentDialogOpen}
                    onClose={handleCloseShipmentDialog}
                    trackingNumber={shipment?.trackingNumber}
                    shippingProvider={shipment?.shippingProvider}
                    onSubmit={handleShipmentSubmit}
                />

                <Button {...sharedProps} onClick={handleOpenShipmentDialog}>
                    Mark Shipped
                </Button>
            </>
        );
    }

    if (orderStatus.is(OrderStatusEnum.SHIPPED)) {
        return (
            <Button size={'large'} color={'primary'}>
                Edit Tracking
            </Button>
        );
    }

    return (
        <Button component={Link} to={`/submissions/${orderId}/view`} {...sharedProps}>
            View
        </Button>
    );
}

export default SubmissionActionButton;
