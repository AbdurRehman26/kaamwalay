import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
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
    customerId: number;
    serviceFee: number;
    shippingFee: number;
    total: number;
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
    customerId,
    serviceFee,
    shippingFee,
    total,
}: ViewSubmissionInformationProps) {
    const classes = useViewSubmissionInformationStyles();

    return (
        <Grid container direction={'row'} className={classes.root}>
            <Grid item xs={4}>
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
            <Grid item xs={4}>
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
                        <TableCell>Customer ID: {customerId}</TableCell>
                    </TableRow>
                </TableInfo>
            </Grid>
            <Grid item xs={4}>
                <TableInfo>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            Service Fee
                        </TableCell>
                        <TableCell>{formatCurrency(serviceFee)}</TableCell>
                    </TableRow>
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
