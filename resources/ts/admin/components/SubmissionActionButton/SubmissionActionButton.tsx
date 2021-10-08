import Button, { ButtonProps } from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ShipmentDialog from '@shared/components/ShipmentDialog/ShipmentDialog';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { OrderStatusEntity } from '@shared/entities/OrderStatusEntity';
import { ShipmentEntity } from '@shared/entities/ShipmentEntity';
import { setOrderShipment } from '@shared/redux/slices/adminOrdersSlice';
import { useAppDispatch } from '../../redux/hooks';
import EditTrackingInformation from './EditTrackingInformation';

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
    shippingProvider?: ShipmentEntity['shippingProvider'];
    trackingNumber?: ShipmentEntity['trackingNumber'];
    buttonOnly?: boolean;
}

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: SubmissionActionButton
 * @date: 14.09.2021
 * @time: 21:43
 */
export function SubmissionActionButton({
    orderId,
    orderStatus,
    trackingNumber,
    shippingProvider,
    buttonOnly,
    ...rest
}: SubmissionActionButtonProps) {
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

    if (orderStatus.is(OrderStatusEnum.GRADED) || orderStatus.is(OrderStatusEnum.SHIPPED)) {
        return (
            <>
                <ShipmentDialog
                    open={isShipmentDialogOpen}
                    onClose={handleCloseShipmentDialog}
                    trackingNumber={trackingNumber}
                    shippingProvider={shippingProvider}
                    onSubmit={handleShipmentSubmit}
                />

                {orderStatus.is(OrderStatusEnum.GRADED) ? (
                    <Button {...sharedProps} onClick={handleOpenShipmentDialog}>
                        Mark Shipped
                    </Button>
                ) : (
                    <>
                        {!buttonOnly ? (
                            <EditTrackingInformation
                                trackingNumber={trackingNumber}
                                shippingProvider={shippingProvider}
                            />
                        ) : null}
                        <Button color={'primary'} onClick={handleOpenShipmentDialog}>
                            Edit Tracking
                        </Button>
                    </>
                )}
            </>
        );
    }

    return (
        <Button component={Link} to={`/submissions/${orderId}/view`} {...sharedProps}>
            View
        </Button>
    );
}

export default SubmissionActionButton;
