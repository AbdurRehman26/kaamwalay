import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton';
import makeStyles from '@mui/styles/makeStyles';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ShipmentDialog from '@shared/components/ShipmentDialog/ShipmentDialog';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { ShippingMethodType } from '@shared/constants/ShippingMethodType';
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

interface SubmissionActionButtonProps extends LoadingButtonProps {
    orderId: number;
    orderStatus: OrderStatusEntity;
    shippingProvider?: ShipmentEntity['shippingProvider'];
    trackingNumber?: ShipmentEntity['trackingNumber'];
    buttonOnly?: boolean;
    inVault?: boolean;
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
    inVault,
    ...rest
}: SubmissionActionButtonProps) {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const [isShipmentDialogOpen, setIsShipmentDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const sharedProps: any = useMemo(
        () => ({
            variant: 'contained',
            color: 'primary',
            size: 'large',
            className: classes.button,
            loading,
            ...rest,
        }),
        [classes.button, rest, loading],
    );

    const view$ = (
        <LoadingButton component={Link} to={`/submissions/${orderId}/view`} {...sharedProps}>
            View
        </LoadingButton>
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

    const handleMarkStoredInVault = useCallback(async () => {
        setLoading(true);
        await dispatch(setOrderShipment({ orderId, shippingMethod: { code: ShippingMethodType.VaultStorage } }));
        setLoading(false);
    }, [dispatch, orderId]);

    const handleCloseShipmentDialog = useCallback(() => {
        setIsShipmentDialogOpen(false);
    }, []);

    if (!orderStatus || orderStatus.is(OrderStatusEnum.PLACED)) {
        return (
            <LoadingButton component={Link} to={`/submissions/${orderId}/review`} {...sharedProps}>
                Review
            </LoadingButton>
        );
    }

    if (orderStatus.is(OrderStatusEnum.CONFIRMED)) {
        return (
            <LoadingButton component={Link} to={`/submissions/${orderId}/grade`} {...sharedProps}>
                Grade
            </LoadingButton>
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
                    inVault ? (
                        <LoadingButton {...sharedProps} onClick={handleMarkStoredInVault}>
                            Mark Stored In Vault
                        </LoadingButton>
                    ) : (
                        <LoadingButton {...sharedProps} onClick={handleOpenShipmentDialog}>
                            Mark Shipped
                        </LoadingButton>
                    )
                ) : !inVault ? (
                    <>
                        {!buttonOnly ? (
                            <EditTrackingInformation
                                trackingNumber={trackingNumber}
                                shippingProvider={shippingProvider}
                            />
                        ) : null}
                        <LoadingButton color={'primary'} onClick={handleOpenShipmentDialog}>
                            Edit Tracking
                        </LoadingButton>
                    </>
                ) : !orderStatus.is(OrderStatusEnum.SHIPPED) ? (
                    view$
                ) : null}
            </>
        );
    }

    return view$;
}
