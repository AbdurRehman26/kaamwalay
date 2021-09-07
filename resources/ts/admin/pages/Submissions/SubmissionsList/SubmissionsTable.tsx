import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MuiLink from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { upperFirst } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { StatusChip } from '@shared/components/StatusChip';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { font } from '@shared/styles/utils';

interface SubmissionsTableProps {
    tabFilter: string;
}

export function SubmissionsTable({ tabFilter }: SubmissionsTableProps) {
    const totals = 3;
    const heading = upperFirst(tabFilter);

    return (
        <Grid container direction={'column'}>
            <Box padding={2.5}>
                <Typography variant={'h6'}>
                    {heading} {totals > 0 ? `(${totals})` : null}
                </Typography>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell variant={'head'}>Submission #</TableCell>
                            <TableCell variant={'head'}>Placed</TableCell>
                            <TableCell variant={'head'}>Arrived</TableCell>
                            <TableCell variant={'head'}>Customer</TableCell>
                            <TableCell variant={'head'}>Cards</TableCell>
                            <TableCell variant={'head'}>Status</TableCell>
                            <TableCell variant={'head'}>Declared Value</TableCell>
                            <TableCell variant={'head'}>Amount Paid</TableCell>
                            <TableCell variant={'head'} />
                            <TableCell variant={'head'} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <MuiLink
                                    component={Link}
                                    color={'primary'}
                                    to={'/submissions/RG808078787/view'}
                                    className={font.fontWeightMedium}
                                >
                                    RG808078787
                                </MuiLink>
                            </TableCell>
                            <TableCell>{formatDate(new Date(), 'MM/DD/YYYY')}</TableCell>
                            <TableCell>{formatDate(new Date(), 'MM/DD/YYYY')}</TableCell>
                            <TableCell>
                                <MuiLink
                                    component={Link}
                                    color={'primary'}
                                    to={'/customers/C89899190/view'}
                                    className={font.fontWeightMedium}
                                >
                                    C89899190
                                </MuiLink>
                            </TableCell>
                            <TableCell>3</TableCell>
                            <TableCell>
                                <StatusChip label={'Reviewed'} />
                            </TableCell>
                            <TableCell>{formatCurrency(400)}</TableCell>
                            <TableCell>{formatCurrency(60)}</TableCell>
                            <TableCell align={'right'}>
                                <Button variant={'contained'} color={'primary'}>
                                    Review
                                </Button>
                            </TableCell>
                            <TableCell align={'right'}>
                                <IconButton size={'small'}>
                                    <MoreVertIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
}

export default SubmissionsTable;
