import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import ShipmentDialog from '@shared/components/ShipmentDialog/ShipmentDialog';
import { setOrderCustomerShipment } from '@shared/redux/slices/ordersSlice';
import { useAppDispatch } from '@dashboard/redux/hooks';

type SubmissionTrackingStatusProps = {
    trackingNumber?: string;
    shippingProvider?: string;
    orderStatus: string;
    invoicePath?: string;
    shipmentNumber?: string;
    shipmentLink?: string;
};

const useStyles = makeStyles(() => ({
    textDescription: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    trackingNumberBtn: {
        marginTop: '12px',
        marginBottom: '12px',
        width: '220px',
    },
    trackingNumberText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.35px',
        textDecorationLine: 'underline',
        color: '#000000',
    },
    trackingNumberContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: '62px',
    },
    shippingTrackingText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.35px',
        color: '#20BFB8',
    },
    shipmentNumberContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
}));

function SubmissionTrackingStatus({
    trackingNumber,
    shippingProvider,
    orderStatus,
    shipmentNumber,
    shipmentLink,
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

    if (orderStatus === 'shipped') {
        return (
            <div className={classes.shipmentNumberContainer}>
                <Typography variant={'subtitle2'} className={classes.textDescription}>
                    Return Shipment Tracking Number
                </Typography>
                <a target="_blank" href={shipmentLink!} className={classes.shippingTrackingText} rel="noreferrer">
                    <Typography variant={'subtitle2'}>{shipmentNumber}</Typography>
                </a>
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
                    <Typography variant={'subtitle2'} className={classes.textDescription}>
                        {!trackingNumber && !shippingProvider
                            ? 'Enter tracking number once you ship your cards.'
                            : 'Tracking Number'}
                    </Typography>
                    {trackingNumber && shippingProvider ? (
                        <div className={classes.trackingNumberContainer}>
                            <Typography variant={'subtitle2'} className={classes.trackingNumberText}>
                                {trackingNumber}
                            </Typography>
                            <Button variant="text" color={'primary'} onClick={handleAddTrackingNumber}>
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
