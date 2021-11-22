import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, { useMemo } from 'react';
import { ShipmentEntity } from '@shared/entities/ShipmentEntity';
import { cx } from '@shared/lib/utils/cx';
import SubmissionTrackingStatus from '@dashboard/pages/Submissions/ViewSubmission/SubmissionTrackingStatus';
import { ViewSubmissionStatusBar } from './ViewSubmissionStatusBar';
import { SubmissionSteps } from './data';
import { useViewSubmissionStatusStyles } from './styles';

interface ViewSubmissionStatusProps {
    orderStatus: string | SubmissionSteps;
    trackingNumber?: string;
    shipmentProvider?: string;
    orderShipment: ShipmentEntity | null;
}

const STATUS_DESCRIPTION_MAP = {
    placed: 'Your submission has been placed. The next step is to ship the cards to us. Once we receive the shipment arrives we will begin grading your cards.',
    confirmed:
        'We have reviewed your cards and will start grading them soon. You will receive an email as soon as grading is complete.',
    graded: 'Your cards have been graded! You can see all grades in the “Your Cards” tab. We are now preparing your cards for return shipment.',
    shipped: 'Your cards have been shipped back to you! They should arrive at your doorstep in the next few days.',
} as any;

/**
 * @parent ViewSubmissionStatus
 * @private
 * @constructor
 */
export function ViewSubmissionStatus({
    orderStatus,
    shipmentProvider,
    trackingNumber,
    orderShipment,
}: ViewSubmissionStatusProps) {
    const classes = useViewSubmissionStatusStyles();
    const steps = useMemo(() => Object.values(SubmissionSteps), []);

    const statusDescription = useMemo(() => STATUS_DESCRIPTION_MAP[orderStatus.toLowerCase()], [orderStatus]);
    return (
        <Grid container direction={'column'} className={classes.root}>
            <Typography variant={'body2'} className={cx(classes.fontMedium, classes.textGutter)}>
                Status:
            </Typography>
            <Typography variant={'h6'} color={'primary'} className={cx(classes.fontMedium, classes.textGutter)}>
                {orderStatus}
            </Typography>
            <Typography variant={'caption'} color={'primary'} className={cx(classes.textGutter, classes.darkText)}>
                {statusDescription}
            </Typography>

            <ViewSubmissionStatusBar steps={steps} currentStep={orderStatus} />

            <SubmissionTrackingStatus
                trackingNumber={trackingNumber!}
                orderStatus={orderStatus.toLowerCase()}
                shippingProvider={shipmentProvider!}
                shipmentLink={orderShipment?.trackingUrl!}
                shipmentNumber={orderShipment?.trackingNumber}
            />
        </Grid>
    );
}
