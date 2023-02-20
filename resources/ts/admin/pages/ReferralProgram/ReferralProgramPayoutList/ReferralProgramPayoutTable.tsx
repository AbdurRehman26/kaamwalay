import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { useListAdminOrdersQuery } from '@shared/redux/hooks/useOrdersQuery';

interface ReferralProgramPayoutTableProps {
    tabFilter?: string;
    all?: boolean;
    search?: string;
}

export function ReferralProgramPayoutTable({}: ReferralProgramPayoutTableProps) {
    const [paymentStatus, setPaymentStatus] = useState(false);
    const [search, setSearch] = useState('');
    const [sortFilter, setSortFilter] = useState('created_at');

    const [payAllStatus, setPayAllStatus] = useState(true);
    const [archiveAllStatus, setArchiveAllStatus] = useState(false);
    const [exportAllStatus, setExportAllStatus] = useState(false);
    const [allSelected, setAllSelected] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // uncomment when APIs ready
    setPaymentStatus(true);
    setPayAllStatus(false);
    setArchiveAllStatus(true);
    setExportAllStatus(true);
    setSearch(search);
    setSortFilter(search);

    const orders = useListAdminOrdersQuery({
        params: {
            include: [
                'orderStatus',
                'customer',
                'customer.wallet',
                'invoice',
                'orderShipment',
                'orderLabel',
                'shippingMethod',
            ],
            sort: sortFilter,
            filter: {
                search,
                paymentStatus,
            },
        },
        ...bracketParams(),
    });

    const handleSelectAll = () => {
        if (!allSelected) {
            const newSelected = orders.data.map((order) => order.id);
            setSelectedIds(newSelected);
            setAllSelected(true);
            console.log('Selected ids ifff ', selectedIds);
            return;
        }
        setSelectedIds([]);
        console.log('Selected ids else', selectedIds);
        setAllSelected(false);
    };

    const handleClick = (id: number) => {
        const selectedIndex = selectedIds.indexOf(id);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedIds, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedIds.slice(1));
        } else if (selectedIndex === selectedIds.length - 1) {
            newSelected = newSelected.concat(selectedIds.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selectedIds.slice(0, selectedIndex), selectedIds.slice(selectedIndex + 1));
        }

        setSelectedIds(newSelected);
        console.log('newSelected ', newSelected);
        console.log('aa aa selectedIds', selectedIds);
    };

    const isSelected = (selectedRowId: number) => selectedIds.indexOf(selectedRowId) !== -1;

    return (
        <Grid container direction={'column'}>
            <Grid container pt={2.5} px={2} pb={2} justifyContent={'flex-start'}>
                <>
                    <Grid item xs container alignItems={'center'}>
                        {selectedIds.length === 0 ? (
                            <Typography sx={{ color: '#000000DE', fontWeight: 400, fontSize: '16px' }}>
                                {orders.data.length > 0 ? `${orders.data.length} Results` : null}
                            </Typography>
                        ) : (
                            <Typography sx={{ color: '#000000DE', fontWeight: 400, fontSize: '16px' }}>
                                {`${selectedIds.length} Selected `}
                            </Typography>
                        )}
                        {selectedIds.length > 0 ? (
                            <Grid xs ml={2} alignItems={'center'}>
                                <Button sx={{ borderRadius: '25px' }} variant={payAllStatus ? 'contained' : 'outlined'}>
                                    Pay Selected
                                </Button>
                                <Button
                                    sx={{ marginLeft: '12px', borderRadius: '25px' }}
                                    variant={archiveAllStatus ? 'contained' : 'outlined'}
                                >
                                    Archieved Selected
                                </Button>
                                <Button
                                    sx={{ marginLeft: '12px', borderRadius: '25px' }}
                                    variant={exportAllStatus ? 'contained' : 'outlined'}
                                >
                                    Export Selected
                                </Button>
                            </Grid>
                        ) : null}
                    </Grid>
                    {selectedIds.length === 0 ? (
                        <Grid item xs container justifyContent={'flex-end'} maxWidth={'240px !important'}>
                            <Button
                                variant={'outlined'}
                                color={'primary'}
                                sx={{ borderRadius: 20, padding: '7px 24px' }}
                                // onClick={handleExportData}
                            >
                                Export List
                            </Button>
                        </Grid>
                    ) : null}
                </>
            </Grid>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell variant={'head'}>
                            <Checkbox
                                color="primary"
                                checked={allSelected}
                                indeterminate={selectedIds.length > 0}
                                onClick={handleSelectAll}
                            />
                            Name / ID
                        </TableCell>
                        <TableCell variant={'head'}>Date Initiated</TableCell>
                        <TableCell variant={'head'}>Date Completed</TableCell>
                        <TableCell variant={'head'}>Payout Account</TableCell>
                        <TableCell variant={'head'}>Status</TableCell>
                        <TableCell variant={'head'}>Paid By</TableCell>
                        <TableCell variant={'head'}>Amount</TableCell>
                        <TableCell variant={'head'} />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders?.data.length > 0 ? (
                        orders.data.map((order) => (
                            <TableRow>
                                <TableCell>
                                    <Checkbox
                                        color="primary"
                                        key={order.id}
                                        checked={isSelected(order.id)}
                                        onClick={(event) => handleClick(order.id)}
                                    />
                                    {order.id}
                                </TableCell>
                                <TableCell>
                                    {' '}
                                    {`${formatDate(order.createdAt, 'MMM D, YYYY')} at ${formatDate(
                                        order.createdAt,
                                        'h:mm:ss A',
                                    )}`}{' '}
                                </TableCell>
                                <TableCell>Date P</TableCell>
                                <TableCell>Account</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Paid By</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell align={'center'} colSpan={9}>
                                <Box padding={2}>
                                    <Typography variant={'subtitle2'}>We couldn't found any payouts yet.</Typography>
                                </Box>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination {...orders.paginationProps} />
                    </TableRow>
                </TableFooter>
            </Table>
        </Grid>
    );
}
