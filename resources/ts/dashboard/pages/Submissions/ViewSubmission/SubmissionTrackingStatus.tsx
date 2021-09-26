import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ShipmentDialog from '@shared/components/ShipmentDialog/ShipmentDialog';
import { setOrderCustomerShipment } from '@shared/redux/slices/ordersSlice';
import { useAppDispatch } from '@dashboard/redux/hooks';

type SubmissionTrackingStatusProps = {
    trackingNumber?: string;
    shippingProvider?: string;
    orderStatus: string;
};

const useStyles = makeStyles({
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
});

function SubmissionTrackingStatus({ trackingNumber, shippingProvider, orderStatus }: SubmissionTrackingStatusProps) {
    const classes = useStyles();
    const { id }: any = useParams();
    const [isShipmentDialogOpen, setIsShipmentDialogOpen] = useState(false);
    const dispatch = useAppDispatch();

    function handleCloseShipmentDialog() {
        setIsShipmentDialogOpen(false);
    }

    const handleShipmentSubmit = useCallback(
        async ({ trackingNumber, shippingProvider }: Record<any, string>) => {
            await dispatch(setOrderCustomerShipment({ trackingNumber, shippingProvider, orderId: id }));
        },
        [dispatch, id],
    );

    function handleAddTrackingNumber() {
        setIsShipmentDialogOpen(true);
    }

    if (orderStatus === 'shipped') {
        return (
            <div className={classes.shipmentNumberContainer}>
                <Typography variant={'subtitle2'} className={classes.textDescription}>
                    Return Shipment Tracking Number
                </Typography>
                <Link to={'/test'} className={classes.shippingTrackingText}>
                    <Typography variant={'subtitle2'}>asd123</Typography>
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
