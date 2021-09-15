import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useState } from 'react';
import DummyCharizard from '@shared/assets/dummyCharizard.png';
import { TablePagination } from '@shared/components/TablePagination';
import font from '@shared/styles/font.module.css';
import { cx } from '../lib/utils/cx';

export const useStyles = makeStyles(
    (theme) => ({
        root: {
            marginTop: theme.spacing(4),
            borderRadius: 3,
            border: '1px solid #e0e0e0',
            '& $header, & $footer': {
                backgroundColor: '#f9f9f9',
            },
        },
        header: {},
        footer: {},
        gutterRight: {
            marginRight: theme.spacing(1),
        },
        cardImage: {
            width: 40,
            height: 56,
            objectFit: 'contain',
            objectPosition: 'center center',
        },
        gradeBadge: {
            width: 36,
            height: 36,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderRadius: 18,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    }),
    { name: 'SubmissionViewCards' },
);

export function SubmissionViewCards() {
    const classes = useStyles();

    const totals = 0;
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const handleChangePage = useCallback((e, page) => setPage(page), [setPage]);
    const handleChangeRowsPerPage = useCallback((e) => setItemsPerPage(e.target.value), [setItemsPerPage]);

    return (
        <Box px={3}>
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
                                <Typography variant={'body2'} className={cx(font.fontWeightBold, classes.gradeBadge)}>
                                    8.7
                                </Typography>
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
        </Box>
    );
}

export default SubmissionViewCards;
