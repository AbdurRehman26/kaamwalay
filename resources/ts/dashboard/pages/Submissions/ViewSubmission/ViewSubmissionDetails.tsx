import Box from '@material-ui/core/Box';
import MuiLink from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import DummyCharizard from '@shared/assets/dummyCharizard.png';
import font from '@shared/styles/font.module.scss';
import { TablePagination } from '@dashboard/components/SubmissionsTable/styles';
import { useViewSubmissionDetailsStyles } from './styles';

/**
 * @parent ViewSubmissionDetails
 * @private
 * @constructor
 */
export function ViewSubmissionDetails() {
    const classes = useViewSubmissionDetailsStyles();
    const totals = 0;
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const handleChangePage = useCallback((e, page) => setPage(page), [setPage]);
    const handleChangeRowsPerPage = useCallback((e) => setItemsPerPage(e.target.value), [setItemsPerPage]);

    return (
        <TableContainer className={classes.root}>
            <Table>
                <TableHead className={classes.header}>
                    <TableRow>
                        <TableCell variant={'head'}>Card</TableCell>
                        <TableCell variant={'head'}>Grade</TableCell>
                        <TableCell variant={'head'}>Value (USD)</TableCell>
                        <TableCell variant={'head'} align={'right'}>
                            Paid
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Box display={'flex'} alignItems={'center'}>
                                <img src={DummyCharizard} className={classes.cardImage} alt={'Charizard'} />
                                <Box display={'flex'} flexDirection={'column'} paddingLeft={1}>
                                    <Typography variant={'body2'}>Charizard</Typography>
                                    <Typography variant={'body2'}>
                                        2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard
                                    </Typography>
                                    <Box>
                                        <Typography
                                            variant={'caption'}
                                            color={'textSecondary'}
                                            className={classes.gutterRight}
                                        >
                                            Card #: 898982
                                        </Typography>
                                        <Typography
                                            variant={'caption'}
                                            color={'textSecondary'}
                                            className={classes.gutterRight}
                                        >
                                            ID: 898982
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                            <Typography variant={'body2'}>$ 400.00</Typography>
                        </TableCell>
                        <TableCell align={'right'}>
                            <Typography variant={'body2'}>$ 20.00</Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Box display={'flex'} alignItems={'center'}>
                                <img src={DummyCharizard} className={classes.cardImage} alt={'Charizard'} />
                                <Box display={'flex'} flexDirection={'column'} paddingLeft={1}>
                                    <Typography variant={'body2'}>Charizard</Typography>
                                    <Typography variant={'body2'}>
                                        2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard
                                    </Typography>
                                    <Box>
                                        <Typography
                                            variant={'caption'}
                                            color={'textSecondary'}
                                            className={classes.gutterRight}
                                        >
                                            Card #: 898982
                                        </Typography>
                                        <Typography
                                            variant={'caption'}
                                            color={'textSecondary'}
                                            className={classes.gutterRight}
                                        >
                                            ID: 898982
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </TableCell>
                        <TableCell>
                            <Typography variant={'body2'} className={font.fontWeightMedium}>
                                8.7
                            </Typography>
                            <MuiLink component={Link} to={'/cards/P7392020/view'} variant={'button'} color={'primary'}>
                                View Grade
                            </MuiLink>
                        </TableCell>
                        <TableCell>
                            <Typography variant={'body2'}>$ 400.00</Typography>
                        </TableCell>
                        <TableCell align={'right'}>
                            <Typography variant={'body2'}>$ 20.00</Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
                <TableFooter className={classes.footer}>
                    <TableRow>
                        <TablePagination
                            count={totals || 0}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={itemsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}
