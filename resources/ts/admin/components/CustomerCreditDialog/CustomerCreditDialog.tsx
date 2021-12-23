import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { ChangeEvent, useCallback, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Collapse, Paper, Stack, TableCell, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import { CustomerHistoryAction, CustomerHistoryRow } from './CustomerHistoryRow';
import moment from 'moment';
import TableContainer from '@mui/material/TableContainer';

interface Props extends DialogProps {
    customerId: number;
}

const Root = styled(Dialog)(({ theme }) => ({
    '.MuiDialog-paper': {
        minWidth: 524,
    },
    '.MuiDialogContent-root': {
        padding: '28px 24px',
    },
    '.MuiDialogActions-root': {
        padding: '18px 24px',
        '.MuiButton-contained': {
            padding: '10px 18px',
            borderRadius: 2,
            marginLeft: theme.spacing(3),
        },
    },
    '.CustomerCreditDialog-history': {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        overflow: 'hidden',
    },
    '.CustomerCreditDialog-customerDescription': {
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.CustomerCreditDialog-customerTableHead': {
        backgroundColor: '#f9f9f9',
        position: 'sticky',
        top: 0,
        boxShadow: '0 1px 0 #ccc',
        '.MuiTableCell-head': {
            paddingTop: 10,
            paddingBottom: 14,
            fontWeight: 500,
            fontSize: 10,
            lineHeight: '16px',
            letterSpacing: '0.75px',
            textTransform: 'uppercase',
            color: theme.palette.text.secondary,
        },
    },
    '.CustomerCreditDialog-customerTableBody': {
        '.MuiTableCell-root': {
            backgroundColor: '#fff',
        },
        '.MuiTableRow-root': {
            '&:last-child .MuiTableCell-body': {
                borderBottom: 'none',
            },
        },
    },
    '.CustomerCreditDialog-customerTableContainer': {
        maxHeight: 300,
        overflowY: 'auto',
    },
}));

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: CustomerCreditDialog
 * @date: 23.12.2021
 * @time: 18:31
 */
export function CustomerCreditDialog({ customerId, onClose, ...rest }: Props) {
    const [amount, setAmount] = useState<string | number>(0);
    const [collapseHistory, setCollapseHistory] = useState(true);

    const handleCollapseHistory = useCallback(() => setCollapseHistory((prev) => !prev), []);

    const handleAmount = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => setAmount(event.target.value ? Number(event.target.value) : ''),
        [],
    );

    const handleClose = useCallback(
        (event: {}) => {
            if (onClose) {
                onClose(event, 'escapeKeyDown');
            }
        },
        [onClose],
    );

    return (
        <Root onClose={handleClose} {...rest}>
            <Grid container alignItems={'center'} justifyContent={'space-between'} py={2} pl={3} pr={2}>
                <Grid item xs container alignItems={'center'} justifyContent={'flex-start'}>
                    <Typography variant={'h6'} fontWeight={500}>
                        Send Credit to Customer
                    </Typography>
                </Grid>

                <Grid item xs container alignItems={'center'} justifyContent={'flex-end'}>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <Divider />
            <DialogContent>
                <Grid container>
                    <Typography variant={'caption'} fontWeight={500}>
                        Credit Amount
                    </Typography>
                    <TextField
                        fullWidth
                        type={'number'}
                        variant={'outlined'}
                        value={amount}
                        onChange={handleAmount}
                        InputProps={{
                            inputProps: {
                                min: 0,
                                step: 0.01,
                            },
                            startAdornment: (
                                <InputAdornment position={'start'}>
                                    <Typography variant={'body2'} color={'textSecondary'}>
                                        $
                                    </Typography>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                <Stack mt={3.5} mb={2}>
                    <Typography variant={'subtitle1'} fontWeight={500}>
                        James Smith
                    </Typography>
                    <Grid container alignItems={'center'}>
                        <Typography variant={'body2'} fontWeight={500} color={'textSecondary'}>
                            Wallet Balance:
                        </Typography>
                        <Typography variant={'body2'} ml={0.5}>
                            {formatCurrency(50)}
                        </Typography>
                    </Grid>
                </Stack>

                <Paper variant={'outlined'} className={'CustomerCreditDialog-history'}>
                    <Grid
                        container
                        py={!collapseHistory ? 1 : 2}
                        pl={2}
                        pr={1}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <Typography variant={'subtitle1'} fontWeight={500}>
                            History
                        </Typography>
                        <IconButton onClick={handleCollapseHistory}>
                            {!collapseHistory ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                        </IconButton>
                    </Grid>
                    <Collapse in={collapseHistory}>
                        <TableContainer className={'CustomerCreditDialog-customerTableContainer'}>
                            <Table>
                                <TableHead className={'CustomerCreditDialog-customerTableHead'}>
                                    <TableRow>
                                        <TableCell variant={'head'}>Date</TableCell>
                                        <TableCell variant={'head'}>Description</TableCell>
                                        <TableCell variant={'head'} align={'right'}>
                                            Amount
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className={'CustomerCreditDialog-customerTableBody'}>
                                    <CustomerHistoryRow
                                        action={CustomerHistoryAction.Added}
                                        amount={50}
                                        date={moment()}
                                        displayName={'Customer'}
                                    />
                                    <CustomerHistoryRow
                                        action={CustomerHistoryAction.Added}
                                        amount={10}
                                        date={moment()}
                                        displayName={'Aaron Arroyo'}
                                    />
                                    <CustomerHistoryRow
                                        action={CustomerHistoryAction.Added}
                                        amount={20}
                                        date={moment()}
                                        displayName={'Aaron Arroyo'}
                                    />
                                    <CustomerHistoryRow
                                        action={CustomerHistoryAction.Added}
                                        amount={10}
                                        date={moment()}
                                        displayName={'Aaron Arroyo'}
                                    />
                                    <CustomerHistoryRow
                                        action={CustomerHistoryAction.Used}
                                        amount={-20}
                                        date={moment()}
                                        displayName={'Customer'}
                                    />
                                    <CustomerHistoryRow
                                        action={CustomerHistoryAction.Added}
                                        amount={10}
                                        date={moment()}
                                        displayName={'Aaron Arroyo'}
                                    />

                                    <CustomerHistoryRow
                                        action={CustomerHistoryAction.Added}
                                        amount={50}
                                        date={moment()}
                                        displayName={'Customer'}
                                    />
                                    <CustomerHistoryRow
                                        action={CustomerHistoryAction.Added}
                                        amount={10}
                                        date={moment()}
                                        displayName={'Aaron Arroyo'}
                                    />
                                    <CustomerHistoryRow
                                        action={CustomerHistoryAction.Added}
                                        amount={20}
                                        date={moment()}
                                        displayName={'Aaron Arroyo'}
                                    />
                                    <CustomerHistoryRow
                                        action={CustomerHistoryAction.Added}
                                        amount={10}
                                        date={moment()}
                                        displayName={'Aaron Arroyo'}
                                    />
                                    <CustomerHistoryRow
                                        action={CustomerHistoryAction.Used}
                                        amount={-20}
                                        date={moment()}
                                        displayName={'Customer'}
                                    />
                                    <CustomerHistoryRow
                                        action={CustomerHistoryAction.Added}
                                        amount={10}
                                        date={moment()}
                                        displayName={'Aaron Arroyo'}
                                    />
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Collapse>
                </Paper>
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button onClick={handleClose} color={'inherit'}>
                    Cancel
                </Button>
                <LoadingButton variant={'contained'}>Apply Credit</LoadingButton>
            </DialogActions>
        </Root>
    );
}
