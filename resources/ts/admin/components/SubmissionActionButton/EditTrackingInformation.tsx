import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useMemo } from 'react';
import { ShipmentProvidersList } from '@shared/constants/ShipmentProviders';
import { ShipmentEntity } from '@shared/entities/ShipmentEntity';

interface EditTrackingInformationProps {
    trackingNumber?: ShipmentEntity['trackingNumber'];
    shippingProvider?: ShipmentEntity['shippingProvider'];
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(0, 3),
        },
        typography: {},
        typographyHighlight: {
            color: 'rgba(0, 0, 0, .87)',
        },
    }),
    { name: 'EditTrackingInformation' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: EditTrackingInformation
 * @date: 21.09.2021
 * @time: 18:17
 */
export function EditTrackingInformation({ trackingNumber, shippingProvider }: EditTrackingInformationProps) {
    const classes = useStyles();

    const shippingProviderName = useMemo(() => {
        return (
            ShipmentProvidersList.find(({ value }) => value === `${shippingProvider}`.toLowerCase())?.label ??
            shippingProvider
        );
    }, [shippingProvider]);

    return (
        <div className={classes.root}>
            <Typography variant={'body2'} color={'textSecondary'} className={classes.typography}>
                Carrier: <span className={classes.typographyHighlight}>{shippingProviderName ?? 'N/A'}</span>
            </Typography>
            <Typography variant={'body2'} color={'textSecondary'} className={classes.typography}>
                Tracking #: <span className={classes.typographyHighlight}>{trackingNumber ?? 'N/A'}</span>
            </Typography>
        </div>
    );
}

export default EditTrackingInformation;
