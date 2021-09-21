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
import { DateLike } from '@shared/lib/datetime/DateLike';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';

interface SubmissionsViewDetailsProps {
    serviceLevelFee: number;
    numberOfCards: number;
    placedAt: DateLike;
    declaredValue: number;
    serviceFee: number;
    shippingFee: number;
    grandTotal: number;
    customerId: number;
    customerNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    billingAddress: AddressEntity;
    shippingAddress: AddressEntity;

    cardLast4?: string;
    cardType?: string;
    cardExpirationMonth?: number;
    cardExpirationYear?: number;
}

const useStyles = makeStyles(
    {
        root: {
            padding: '24px',
        },
    },
    { name: 'SubmissionViewDetails' },
);

export function SubmissionsViewDetails(props: SubmissionsViewDetailsProps) {
    const {
        numberOfCards,
        serviceLevelFee,
        placedAt,
        declaredValue,
        customerName,
        customerEmail,
        customerPhone,
        customerId,
        customerNumber,
        serviceFee,
        shippingFee,
        grandTotal,
        billingAddress,
        shippingAddress,
        cardLast4,
        cardType,
        cardExpirationMonth,
        cardExpirationYear,
    } = props;

    const classes = useStyles();
    const orderInfo = useMemo(
        () => ({
            'Service level:': `${formatCurrency(serviceLevelFee)} / Card`,
            'No. of Cards:': numberOfCards,
            'Shipping Method': 'Insured',
            'Placed:': formatDate(placedAt, 'MM/DD/YYYY [at] hh:mm A'),
            'Declared Value:': formatCurrency(declaredValue),
        }),
        [declaredValue, numberOfCards, placedAt, serviceLevelFee],
    );

    const customerInfo = useMemo(
        () =>
            [
                ['Customer:', customerName],
                customerEmail ? ['', <MuiLink href={`mailto:${customerEmail}`}>{customerEmail}</MuiLink>] : null,
                customerPhone ? ['', <MuiLink href={`tel:${customerPhone}`}>{customerPhone}</MuiLink>] : null,
                [
                    '',
                    <>
                        Customer ID:&nbsp;
                        <MuiLink component={Link} to={`/customers/${customerId}/view`} color={'primary'}>
                            {customerNumber}
                        </MuiLink>
                    </>,
                ],
            ].filter(Boolean),
        [customerEmail, customerId, customerName, customerNumber, customerPhone],
    );

    const paymentInfo = useMemo(
        () => ({
            'Total Declared Value:': formatCurrency(declaredValue),
            'Service Fee:': formatCurrency(serviceFee),
            'Insured Shipping:': formatCurrency(shippingFee),
            'Total:': formatCurrency(grandTotal),
        }),
        [declaredValue, grandTotal, serviceFee, shippingFee],
    );

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
                billingAddress={billingAddress}
                shippingAddress={shippingAddress}
                cardLast4={cardLast4}
                cardType={cardType}
                cardExpirationMonth={cardExpirationMonth}
                cardExpirationYear={cardExpirationYear}
            />
        </Grid>
    );
}

export default SubmissionsViewDetails;
