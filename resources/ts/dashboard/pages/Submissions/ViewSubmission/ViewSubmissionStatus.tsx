import InfoTwoTone from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useMemo } from 'react';
import { ShippingMethodType } from '@shared/constants/ShippingMethodType';
import { ShipmentEntity } from '@shared/entities/ShipmentEntity';
import { ShippingMethodEntity } from '@shared/entities/ShippingMethodEntity';
import { cx } from '@shared/lib/utils/cx';
import { SubmissionEstimatedDelivery } from './SubmissionEstimatedDelivery';
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
    serviceLevel: string;
    turnAround: string;
    estimatedDeliveryStartAt: string;
    estimatedDeliveryEndAt: string;
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
    serviceLevel,
    turnAround,
    estimatedDeliveryStartAt,
    estimatedDeliveryEndAt,
}: ViewSubmissionStatusProps) {
    const isVaultStorage = shippingMethod?.code === ShippingMethodType.VaultStorage;

    const classes = useViewSubmissionStatusStyles();
    const steps = useMemo(() => Object.values(SubmissionSteps), []);
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    function getPreShipmentNoteContent() {
        const isVaultStorage = shippingMethod?.code === ShippingMethodType.VaultStorage;
        const preShipmentNote = 'PLEASE NOTE: You won’t be able to see your grades until your cards are ';
        if (isVaultStorage) {
            return `${preShipmentNote} stored in vault.`;
        }
        return `${preShipmentNote} shipped.`;
    }
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
        <Grid container direction={'column'} className={classes.root} mb={3}>
            <Typography variant={'body2'} className={cx(classes.fontMedium, classes.textGutter)}>
                Status:
            </Typography>
            <Typography variant={'h6'} color={'primary'} className={cx(classes.fontMedium, classes.textGutter)}>
                {statusTitle}
            </Typography>
            <Typography variant={'caption'} color={'primary'} className={cx(classes.textGutter, classes.darkText)}>
                {statusDescription}
            </Typography>
            {orderStatus.toLowerCase() !== 'shipped' ? (
                <Box display={'flex'} alignItems={'center'}>
                    <IconButton sx={{ paddingLeft: '0px', paddingRight: '6px', paddingTop: '6px' }}>
                        <InfoTwoTone />
                    </IconButton>

                    <Typography sx={{ fontWeight: '500', fontSize: '14px' }} mt={isMobile ? 2 : 0}>
                        {getPreShipmentNoteContent()}
                    </Typography>
                </Box>
            ) : null}

            <ViewSubmissionStatusBar steps={steps} currentStep={orderStatus} isVaultStorage={isVaultStorage} />

            <SubmissionTrackingStatus
                trackingNumber={trackingNumber!}
                orderStatus={orderStatus.toLowerCase()}
                shippingProvider={shipmentProvider!}
                shipmentLink={orderShipment?.trackingUrl!}
                shipmentNumber={orderShipment?.trackingNumber}
                shippingMethod={shippingMethod}
            />

            <Divider />
            <Grid
                display={isMobile ? 'grid' : 'flex'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                mt={3}
                width={'100%'}
            >
                <Grid
                    item
                    md={6}
                    sm={12}
                    xs={12}
                    p={2}
                    sx={{ border: '1px solid #E0E0E0', borderRadius: '4px', paddingBottom: isPaid ? '0px' : '12px' }}
                >
                    <SubmissionShippingMethod orderId={orderId} shippingMethod={shippingMethod} paid={isPaid} />
                </Grid>
                {estimatedDeliveryStartAt && estimatedDeliveryEndAt && !isVaultStorage ? (
                    <Grid
                        item
                        md={6}
                        sm={12}
                        xs={12}
                        p={2}
                        ml={!isMobile ? 2 : 0}
                        mt={isMobile ? 2 : 0}
                        sx={{
                            border: '1px solid #E0E0E0',
                            borderRadius: '4px',
                            paddingBottom: isPaid ? '0px' : '12px',
                        }}
                    >
                        <SubmissionEstimatedDelivery
                            serviceLevel={serviceLevel}
                            turnAround={turnAround}
                            estimatedDeliveryStartAt={estimatedDeliveryStartAt}
                            estimatedDeliveryEndAt={estimatedDeliveryEndAt}
                        ></SubmissionEstimatedDelivery>
                    </Grid>
                ) : null}
            </Grid>
        </Grid>
    );
}
