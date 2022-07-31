import ErrorIcon from '@mui/icons-material/Error';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, { useMemo } from 'react';
import { ShippingMethodType } from '@shared/constants/ShippingMethodType';
import { ShipmentEntity } from '@shared/entities/ShipmentEntity';
import { ShippingMethodEntity } from '@shared/entities/ShippingMethodEntity';
import { cx } from '@shared/lib/utils/cx';
import { SubmissionShippingMethod } from './SubmissionShippingMethod';
import { SubmissionTrackingStatus } from './SubmissionTrackingStatus';
import { ViewSubmissionStatusBar } from './ViewSubmissionStatusBar';
import { SubmissionSteps } from './data';
import { useViewSubmissionStatusStyles } from './styles';

interface ViewSubmissionStatusProps {
    orderId?: number;
    orderStatus: string | SubmissionSteps;
    trackingNumber?: string;
    shipmentProvider?: string;
    orderShipment: ShipmentEntity | null;
    shippingMethod?: ShippingMethodEntity;
    isPaid?: boolean;
}

const STATUS_DESCRIPTION_MAP = {
    placed: 'Your submission has been placed. The next step is to ship the cards to us. Once we receive the shipment arrives we will begin grading your cards.',
    confirmed:
        'We have reviewed your cards and will start grading them soon. You will receive an email as soon as grading is complete.',
    graded: 'Your cards have been graded! We are now preparing your cards for shipment. You can see all grades in "Your Cards" tab, once they are shipped.',
    gradedVaultStorage:
        'Your cards have been graded! We are now preparing your cards for vault storage. You can see all grades in "Your Cards" tab, once they are stored in the vault.',
    assembled:
        'Your graded cards have been slabbed and packed for shipment! We will notify you via email as soon as your cards are graded so you can preview your grades.',
    shipped: 'Your cards have been shipped! You can now see all your grades in "Your Cards" tab.',
    shippedVaultStorage:
        'Your cards have been stored in the AGS vault! You can now see all your grades in "Your Cards" tab.',
} as any;

/**
 * @parent ViewSubmissionStatus
 * @private
 * @constructor
 */
export function ViewSubmissionStatus({
    orderId,
    orderStatus,
    shipmentProvider,
    trackingNumber,
    orderShipment,
    shippingMethod,
    isPaid,
}: ViewSubmissionStatusProps) {
    const isVaultStorage = shippingMethod?.code === ShippingMethodType.VaultStorage;

    const classes = useViewSubmissionStatusStyles();
    const steps = useMemo(() => Object.values(SubmissionSteps), []);

    const statusTitle = useMemo(() => {
        if (orderStatus.toLowerCase() === 'shipped' && isVaultStorage) {
            return 'Stored in Vault';
        }

        return orderStatus;
    }, [isVaultStorage, orderStatus]);

    const statusDescription = useMemo(() => {
        if (orderStatus.toLowerCase() === 'shipped' && isVaultStorage) {
            return STATUS_DESCRIPTION_MAP.shippedVaultStorage;
        }

        if (orderStatus.toLowerCase() === 'graded' && isVaultStorage) {
            return STATUS_DESCRIPTION_MAP.gradedVaultStorage;
        }

        return STATUS_DESCRIPTION_MAP[orderStatus.toLowerCase()];
    }, [isVaultStorage, orderStatus]);

    return (
        <Grid container direction={'column'} className={classes.root}>
            <Typography variant={'body2'} className={cx(classes.fontMedium, classes.textGutter)}>
                Status:
            </Typography>
            <Typography variant={'h6'} color={'primary'} className={cx(classes.fontMedium, classes.textGutter)}>
                {statusTitle}
            </Typography>
            <Typography variant={'caption'} color={'primary'} className={cx(classes.textGutter, classes.darkText)}>
                {statusDescription}
            </Typography>
            <Grid marginBottom={1} item alignItems={'end'} display={'flex'}>
                <ErrorIcon
                    sx={{
                        marginRight: '4px',
                        color: 'rgba(0, 0, 0, 0.54)',
                    }}
                />
                <Typography
                    mt={1}
                    variant={'body2'}
                    color={'primary'}
                    className={cx(classes.fontMedium, classes.darkText)}
                >
                    PLEASE NOTE: You won't be able to see your grades until your cards are shipped.
                </Typography>
            </Grid>

            <ViewSubmissionStatusBar steps={steps} currentStep={orderStatus} isVaultStorage={isVaultStorage} />

            <SubmissionTrackingStatus
                trackingNumber={trackingNumber!}
                orderStatus={orderStatus.toLowerCase()}
                shippingProvider={shipmentProvider!}
                shipmentLink={orderShipment?.trackingUrl!}
                shipmentNumber={orderShipment?.trackingNumber}
                shippingMethod={shippingMethod}
            />

            <SubmissionShippingMethod orderId={orderId} shippingMethod={shippingMethod} paid={isPaid} />
        </Grid>
    );
}
