import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import ShipmentDialog from '@shared/components/ShipmentDialog/ShipmentDialog';
import { ShippingMethodType } from '@shared/constants/ShippingMethodType';
import { ShippingMethodEntity } from '@shared/entities/ShippingMethodEntity';
import { setOrderCustomerShipment } from '@shared/redux/slices/ordersSlice';
import { font } from '@shared/styles/utils';
import { useAppDispatch } from '@dashboard/redux/hooks';

type SubmissionTrackingStatusProps = {
    trackingNumber?: string;
    shippingProvider?: string;
    orderStatus: string;
    invoicePath?: string;
    shipmentNumber?: string;
    shipmentLink?: string;
    shippingMethod?: ShippingMethodEntity;
};

const useStyles = makeStyles(
    (theme) => ({
        trackingNumberBtn: {
            marginTop: '12px',
            marginBottom: '12px',
            width: '220px',
        },
        trackingNumberContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing(2),
        },
        trackingNumberContainerText: {
            marginRight: theme.spacing(1),
        },
        shipmentNumberContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginBottom: theme.spacing(3),
        },
    }),
    {
        name: 'SubmissionTrackingStatus',
    },
);

function SubmissionTrackingStatus({
    trackingNumber,
    shippingProvider,
    orderStatus,
    shipmentNumber,
    shipmentLink,
    shippingMethod,
}: SubmissionTrackingStatusProps) {
    const classes = useStyles();
    const { id }: any = useParams();
    const [isShipmentDialogOpen, setIsShipmentDialogOpen] = useState(false);
    const dispatch = useAppDispatch();

    const handleShipmentSubmit = useCallback(
        async ({ trackingNumber, shippingProvider }: Record<any, string>) => {
            await dispatch(setOrderCustomerShipment({ trackingNumber, shippingProvider, orderId: id }));
        },
        [dispatch, id],
    );

    const handleCloseShipmentDialog = useCallback(() => {
        setIsShipmentDialogOpen(false);
    }, []);

    const handleAddTrackingNumber = useCallback(() => {
        setIsShipmentDialogOpen(true);
    }, []);

    if (shippingMethod?.code !== ShippingMethodType.InsuredShipping) {
        return null;
    }

    if (orderStatus === 'shipped') {
        return (
            <div className={classes.shipmentNumberContainer}>
                <Typography variant={'caption'} className={font.fontWeightMedium}>
                    Return Shipment Tracking Number
                </Typography>
                <Link target="_blank" href={shipmentLink!} rel="noreferrer">
                    {shipmentNumber}
                </Link>
            </div>
        );
    }

    return (
        <Grid direction={'column'} container>
            {orderStatus !== 'placed' ? null : (
                <>
                    <ShipmentDialog
                        open={isShipmentDialogOpen}
                        onClose={handleCloseShipmentDialog}
                        trackingNumber={trackingNumber}
                        shippingProvider={shippingProvider}
                        onSubmit={handleShipmentSubmit}
                    />
                    <Typography variant={'caption'}>
                        {!trackingNumber && !shippingProvider
                            ? 'Enter tracking number once you ship your cards.'
                            : 'Tracking Number'}
                    </Typography>
                    {trackingNumber && shippingProvider ? (
                        <div className={classes.trackingNumberContainer}>
                            <Typography variant={'subtitle2'} className={classes.trackingNumberContainerText}>
                                {trackingNumber}
                            </Typography>
                            <Button variant={'text'} size={'medium'} onClick={handleAddTrackingNumber}>
                                Edit
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="outlined"
                            color="primary"
                            className={classes.trackingNumberBtn}
                            onClick={handleAddTrackingNumber}
                        >
                            Enter Tracking Number
                        </Button>
                    )}
                </>
            )}
        </Grid>
    );
}

export default SubmissionTrackingStatus;
