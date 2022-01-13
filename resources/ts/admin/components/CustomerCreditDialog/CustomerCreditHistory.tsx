import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { CustomerHistoryRow } from './CustomerHistoryRow';
import Paper from '@mui/material/Paper';
import { useCallback, useState } from 'react';
import { useRepository } from '@shared/hooks/useRepository';
import { WalletRepository } from '@shared/repositories/Admin/WalletRepository';
import useSWR from 'swr';

interface CustomerCreditHistoryProps {
    walletId?: number;
}

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: CustomerCreditHistory
 * @date: 12.01.2022
 * @time: 20:06
 */
export function CustomerCreditHistory({ walletId }: CustomerCreditHistoryProps) {
    const walletRepository = useRepository(WalletRepository);
    const [collapseHistory, setCollapseHistory] = useState(true);
    const handleCollapseHistory = useCallback(() => setCollapseHistory((prev) => !prev), []);
    const walletHistory = useSWR(
        `walletHistory/${walletId ?? ''}`,
        () => {
            if (walletId) {
                return walletRepository.getHistory(walletId);
            }

            return null;
        },
        {},
    );

    if (!walletHistory.data?.length) {
        return (
            <Grid
                container
                direction={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                border={'1px solid #ccc'}
                borderRadius={1}
                padding={5}
            >
                <Typography variant={'h6'} color={'textSecondary'} fontWeight={500} mb={0.5}>
                    No history.
                </Typography>
                <Typography variant={'body2'} color={'textSecondary'} fontWeight={500}>
                    No available history for this customer.
                </Typography>
            </Grid>
        );
    }

    return (
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
                            {walletHistory.data.map((history) => (
                                <CustomerHistoryRow
                                    key={history.id}
                                    description={history.description}
                                    amount={history.amount}
                                    date={history.createdAt}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Collapse>
        </Paper>
    );
}
