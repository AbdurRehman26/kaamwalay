import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';

import { formatDate } from '@shared/lib/datetime/formatDate';

import { TableInfo } from '@dashboard/pages/Submissions/ViewSubmission/TableInfo';

import { useViewSubmissionInformationStyles } from './styles';

/**
 * @parent ViewSubmissionInformation
 * @private
 * @constructor
 */
export function ViewSubmissionInformation() {
    const classes = useViewSubmissionInformationStyles();

    return (
        <Grid container direction={'row'} className={classes.root}>
            <Grid item xs={4}>
                <TableInfo>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            Service Level
                        </TableCell>
                        <TableCell>Basic</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            No. of Cards
                        </TableCell>
                        <TableCell>1</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            Shipping Method
                        </TableCell>
                        <TableCell>Insured</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            Service Level
                        </TableCell>
                        <TableCell>Basic</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            Date
                        </TableCell>
                        <TableCell>{formatDate(new Date(), 'M/DD/YYYY')}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            Declared Value
                        </TableCell>
                        <TableCell>$400.00</TableCell>
                    </TableRow>
                </TableInfo>
            </Grid>
            <Grid item xs={4}>
                <TableInfo>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            Customer
                        </TableCell>
                        <TableCell>James Smith</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            &nbsp;
                        </TableCell>
                        <TableCell>jsmith@email.com</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            &nbsp;
                        </TableCell>
                        <TableCell>(718) 999-1910</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            &nbsp;
                        </TableCell>
                        <TableCell>Customer ID: 9090090</TableCell>
                    </TableRow>
                </TableInfo>
            </Grid>
            <Grid item xs={4}>
                <TableInfo>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            Service Fee
                        </TableCell>
                        <TableCell>$20.00</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            Insured Shipping
                        </TableCell>
                        <TableCell>$14.00</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell variant={'head'} component={'th'}>
                            Total
                        </TableCell>
                        <TableCell>$34.00</TableCell>
                    </TableRow>
                </TableInfo>
            </Grid>
        </Grid>
    );
}
