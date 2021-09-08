import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import MuiLink from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import KeyValueTable from '@shared/components/KeyValueTable';
import { SubmissionViewBilling } from '@shared/components/SubmissionViewBilling';
import { AddressEntity } from '@shared/entities/AddressEntity';
import { CountryEntity } from '@shared/entities/CountryEntity';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';

const useStyles = makeStyles(
    {
        root: {
            padding: '24px',
        },
    },
    { name: 'SubmissionViewDetails' },
);

export function SubmissionsViewDetails() {
    const classes = useStyles();

    const orderInfo = useMemo(
        () => ({
            'Service level:': `${formatCurrency(20)} / Card`,
            'No. of Cards:': 1,
            'Shipping Method': 'Insured',
            'Placed:': formatDate(new Date(), 'MM/DD/YYYY [at] hh:mm A'),
            'Declared Value:': formatCurrency(400),
        }),
        [],
    );

    const customerInfo = useMemo(
        () => [
            ['Customer:', 'James Smith'],
            ['', 'jsmith@email.com'],
            ['', '(718) 999-1910'],
            [
                '',
                <>
                    Customer ID:&nbsp;
                    <MuiLink component={Link} to={'/customers/C9090090/view'} color={'primary'}>
                        C9090090
                    </MuiLink>
                </>,
            ],
        ],
        [],
    );

    const paymentInfo = useMemo(
        () => ({
            'Total Declared Value:': formatCurrency(400),
            'Service Fee:': formatCurrency(20),
            'Insured Shipping:': formatCurrency(14),
            'Total:': formatCurrency(34),
        }),
        [],
    );

    // TODO: Remove
    const _address = new AddressEntity();
    _address.id = 1;
    _address.address = '727 Amsterdam Blvd.';
    _address.city = 'New York';
    _address.state = 'NY';
    _address.zip = '10301';
    _address.phone = '(718) 999-1910';
    _address.flat = '11';
    _address.firstName = 'James';
    _address.lastName = 'Smith';
    _address.country = new CountryEntity();
    _address.country.name = 'United States';
    _address.country.code = 'US';

    return (
        <Grid container direction={'column'} className={classes.root}>
            <Grid container spacing={4}>
                <Grid item xs>
                    <KeyValueTable entries={orderInfo} />
                </Grid>
                <Grid item xs>
                    <KeyValueTable entries={customerInfo} />
                </Grid>
                <Grid item xs>
                    <KeyValueTable entries={paymentInfo} />
                </Grid>
            </Grid>
            <Box marginY={4}>
                <Divider />
            </Box>
            <SubmissionViewBilling
                billingAddress={_address}
                shippingAddress={_address}
                cardLast4={7972}
                cardType={'visa'}
                cardExpirationMonth={8}
                cardExpirationYear={25}
            />
        </Grid>
    );
}

export default SubmissionsViewDetails;
