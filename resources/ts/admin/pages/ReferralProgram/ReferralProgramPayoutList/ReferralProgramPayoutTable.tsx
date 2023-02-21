import Avatar from '@mui/material/Avatar';
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
import { PayoutStatusEnum } from '@shared/constants/PayoutStatusEnum';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { useAdminReferralPayoutsQuery } from '@shared/redux/hooks/useAdminReferralPayoutsQuery';
import PayoutCommissionDialog from './PayoutCommissionDialog';

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
    const [showPayoutCommission, setShowPayoutCommission] = useState(false);

    // uncomment when APIs ready
    setPaymentStatus(true);
    setPayAllStatus(false);
    setArchiveAllStatus(true);
    setExportAllStatus(true);
    setSearch(search);
    setSortFilter(search);

    const payouts = useAdminReferralPayoutsQuery({
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

    console.log('payouts ', payouts);

    const handleSelectAll = () => {
        if (!allSelected) {
            const newSelected = payouts.data.map((payout) => payout.id);
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
        <>
            <Grid container direction={'column'}>
                <Grid container pt={2.5} px={2} pb={2} justifyContent={'flex-start'}>
                    <>
                        <Grid item xs container alignItems={'center'}>
                            {selectedIds.length === 0 ? (
                                <Typography sx={{ color: '#000000DE', fontWeight: 400, fontSize: '16px' }}>
                                    {payouts.data.length > 0 ? `${payouts.data.length} Results` : null}
                                </Typography>
                            ) : (
                                <Typography sx={{ color: '#000000DE', fontWeight: 400, fontSize: '16px' }}>
                                    {`${selectedIds.length} Selected `}
                                </Typography>
                            )}
                            {selectedIds.length > 0 ? (
                                <Grid xs ml={2} alignItems={'center'}>
                                    <Button
                                        sx={{ borderRadius: '25px' }}
                                        variant={payAllStatus ? 'contained' : 'outlined'}
                                    >
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
                        {payouts?.data.length > 0 ? (
                            payouts.data.map((payout) => (
                                <TableRow>
                                    <TableCell>
                                        <Grid container>
                                            <Checkbox
                                                color="primary"
                                                key={payout.id}
                                                checked={isSelected(payout.id)}
                                                onClick={(event) => handleClick(payout.id)}
                                            />
                                            <Avatar src={payout.user.profileImage ?? ''}>
                                                {payout.user.getInitials()}
                                            </Avatar>
                                            <Grid item xs container direction={'column'} pl={2}>
                                                <Typography variant={'body2'}>{payout.user.fullName}</Typography>
                                                <Typography variant={'caption'} color={'textSecondary'}>
                                                    {payout.user.customerNumber}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell>
                                        {' '}
                                        {`${formatDate(payout.initiatedAt, 'MMM D, YYYY')} at ${formatDate(
                                            payout.initiatedAt,
                                            'h:mm:ss A',
                                        )}`}{' '}
                                    </TableCell>
                                    <TableCell>
                                        {' '}
                                        {`${formatDate(payout.completedAt, 'MMM D, YYYY')} at ${formatDate(
                                            payout.completedAt,
                                            'h:mm:ss A',
                                        )}`}{' '}
                                    </TableCell>
                                    <TableCell>{payout.payoutAccount}</TableCell>
                                    <TableCell>
                                        {Object.entries(PayoutStatusEnum).map(([key, status]) => {
                                            return <Typography>{/* { status[payout.payoutStatus] } */}</Typography>;
                                        })}
                                    </TableCell>
                                    <TableCell>{payout.paidBy.getFullName()}</TableCell>
                                    <TableCell>{payout.amount}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => setShowPayoutCommission(true)} variant={'contained'}>
                                            Pay
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell align={'center'} colSpan={9}>
                                    <Box padding={2}>
                                        <Typography variant={'subtitle2'}>
                                            We couldn't found any payouts yet.
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination {...payouts.paginationProps} />
                        </TableRow>
                    </TableFooter>
                </Table>
                <PayoutCommissionDialog
                    onSubmit={() => setShowPayoutCommission(false)}
                    onClose={() => setShowPayoutCommission(false)}
                    open={showPayoutCommission}
                    totalRecipient={2}
                    totalPayout={5}
                />
            </Grid>
        </>
    );
}
