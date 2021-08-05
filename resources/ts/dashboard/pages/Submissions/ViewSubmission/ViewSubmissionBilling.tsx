import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';

import VisaIcon from '@shared/assets/icons/visa.svg';
import font from '@shared/styles/font.module.scss';

import { useViewSubmissionBillingStyles } from './styles';

/**
 * @parent ViewSubmissionBilling
 * @private
 * @constructor
 */
export function ViewSubmissionBilling() {
    const classes = useViewSubmissionBillingStyles();

    return (
        <Grid container direction={'row'} className={classes.root} spacing={4}>
            <Grid item xs={4}>
                <Typography variant={'body1'} className={font.fontWeightMedium}>
                    Shipping Address
                </Typography>
                <Typography variant={'body2'}>James Smith</Typography>
                <Typography variant={'body2'}>727 Amsterdam Blvd.</Typography>
                <Typography variant={'body2'}>New York, NY 10301, US</Typography>
                <Typography variant={'body2'}>(718) 999-1910</Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant={'body1'} className={font.fontWeightMedium}>
                    Payment Method
                </Typography>

                <Box display={'flex'} alignItems={'center'} width={'100%'}>
                    <Avatar src={VisaIcon} className={classes.paymentAvatar} />
                    <Box display={'flex'} flexDirection={'column'} flexGrow={1} paddingLeft={1}>
                        <Typography variant={'caption'}>Visa ending in 7972</Typography>
                        <Typography variant={'caption'}>Expires 08/25</Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={4}>
                <Typography variant={'body1'} className={font.fontWeightMedium}>
                    Billing Address
                </Typography>
                <Typography variant={'body2'}>Same as shipping</Typography>
            </Grid>
        </Grid>
    );
}
