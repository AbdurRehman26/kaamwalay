import Grid from '@mui/material/Grid';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Moment } from 'moment';
import React from 'react';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { TableInfo } from '@dashboard/pages/Submissions/ViewSubmission/TableInfo';
import { useViewSubmissionInformationStyles } from './styles';

interface ViewSubmissionInformationProps {
    serviceLevel: string;
    numberOfCards: number;
    shippingMethod: string;
    createdAt: Moment | Date;
    declaredValue: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerNumber: string;
    refundsTotal: string | number;
    extraChargesTotal: string | number;
    serviceFee: number;
    shippingFee: number;
    total: number;
    discountedAmount: string;
}

/**
 * @parent ViewSubmissionInformation
 * @private
 * @constructor
 */
export function ViewSubmissionInformation({
    serviceLevel,
    numberOfCards,
    shippingMethod,
    createdAt,
    declaredValue,
    customerName,
    customerEmail,
    customerPhone,
    customerNumber,
    serviceFee,
    shippingFee,
    extraChargesTotal,
    refundsTotal,
    total,
    discountedAmount,
}: ViewSubmissionInformationProps) {
    const classes = useViewSubmissionInformationStyles();

    return (
        <Grid container direction={'row'} className={classes.root}>
            <Grid item xs={12} sm={4}>
                <TableInfo>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            Service Level
                        </TableCell>
                        <TableCell>{serviceLevel}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            No. of Cards
                        </TableCell>
                        <TableCell>{numberOfCards}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            Shipping Method
                        </TableCell>
                        <TableCell>{shippingMethod}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            Date
                        </TableCell>
                        <TableCell>{formatDate(createdAt, 'M/DD/YYYY')}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            Declared Value
                        </TableCell>
                        <TableCell>{formatCurrency(declaredValue)}</TableCell>
                    </TableRow>
                </TableInfo>
            </Grid>
            <Grid item xs={12} sm={4}>
                <TableInfo>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            Customer
                        </TableCell>
                        <TableCell>{customerName}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            &nbsp;
                        </TableCell>
                        <TableCell>{customerEmail}</TableCell>
                    </TableRow>
                    {customerPhone ? (
                        <TableRow>
                            <TableCell variant={'head'} component={'th'}>
                                &nbsp;
                            </TableCell>
                            <TableCell>{customerPhone}</TableCell>
                        </TableRow>
                    ) : null}
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            &nbsp;
                        </TableCell>
                        <TableCell>Customer ID: {customerNumber}</TableCell>
                    </TableRow>
                </TableInfo>
            </Grid>
            <Grid item xs={12} sm={4}>
                <TableInfo>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            Service Fee
                        </TableCell>
                        <TableCell>{formatCurrency(serviceFee)}</TableCell>
                    </TableRow>
                    {Number(discountedAmount) > 0 ? (
                        <TableRow>
                            <TableCell variant={'head'} component={'th'}>
                                Promo Code Discount
                            </TableCell>
                            <TableCell>{`-${formatCurrency(Number(discountedAmount))}`}</TableCell>
                        </TableRow>
                    ) : null}
                    {extraChargesTotal ? (
                        <TableRow>
                            <TableCell variant={'head'} component={'th'}>
                                Extra Charge
                            </TableCell>
                            <TableCell>{formatCurrency(extraChargesTotal)}</TableCell>
                        </TableRow>
                    ) : null}
                    {refundsTotal ? (
                        <TableRow>
                            <TableCell variant={'head'} component={'th'}>
                                Refund
                            </TableCell>
                            <TableCell>-{formatCurrency(refundsTotal)}</TableCell>
                        </TableRow>
                    ) : null}
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            Insured Shipping
                        </TableCell>
                        <TableCell>{formatCurrency(shippingFee)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            Total
                        </TableCell>
                        <TableCell>{formatCurrency(total)}</TableCell>
                    </TableRow>
                </TableInfo>
            </Grid>
        </Grid>
    );
}
