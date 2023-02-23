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
import React, { useEffect, useState } from 'react';
import { PayoutStatusEnum } from '@shared/constants/PayoutStatusEnum';
import { PayoutEntity } from '@shared/entities/PayoutEntity';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { toApiPropertiesObject } from '@shared/lib/utils/toApiPropertiesObject';
import { useAdminReferralPayoutsQuery } from '@shared/redux/hooks/useAdminReferralPayoutsQuery';
import PayoutCommissionDialog from './PayoutCommissionDialog';

interface ReferralProgramPayoutTableProps {
    tabFilter?: PayoutStatusEnum;
    all?: boolean;
    search?: string;
}
export function ReferralProgramPayoutTable({ search, all, tabFilter }: ReferralProgramPayoutTableProps) {
    const [sortFilter, setSortFilter] = useState('created_at');
    const [payoutTotal, setPayoutTotal] = useState(0);
    const [isPayOne, setIsPayOne] = useState(false);
    const [isSearchEnabled, setIsSearchEnabled] = useState(false);
    const [allSelected, setAllSelected] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showPayoutCommission, setShowPayoutCommission] = useState(false);
    setSortFilter('');
    const payouts = useAdminReferralPayoutsQuery({
        params: {
            filter: {
                search: search,
                referrerPayoutStatusId: tabFilter,
            },
        },
        ...bracketParams(),
    });

    const handlePayCommission = () => {
        setShowPayoutCommission(true);
    };

    useEffect(() => {
        payouts.data
            ?.filter((payout: PayoutEntity) => selectedIds.find((id) => id === payout.id))
            .map((payout: PayoutEntity) => {
                setPayoutTotal(payoutTotal + Number(payout.amount));
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIds.length]);

    useEffect(
        () => {
            // noinspection JSIgnoredPromiseFromCall
            if (!payouts.isLoading && isSearchEnabled) {
                // noinspection JSIgnoredPromiseFromCall
                payouts.searchSortedWithPagination(
                    { sort: sortFilter },
                    toApiPropertiesObject({
                        search,
                        referrerPayoutStatusId: tabFilter,
                    }),
                    1,
                );
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [search, isSearchEnabled, sortFilter],
    );

    useEffect(() => {
        setIsSearchEnabled(true);
    }, []);

    const handleSelectAll = () => {
        if (!allSelected) {
            const newSelected = payouts.data.map((payout) => payout.id);
            setSelectedIds(newSelected);
            setAllSelected(true);
            return;
        }
        setSelectedIds([]);
        setAllSelected(false);
    };

    const handleRowClick = (id: number, amount: number) => {
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
    };

    const handlePay = (id: number, amount: number) => {
        handleRowClick(id, amount);
        setIsPayOne(true);
        handlePayCommission();
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
                            {(!isPayOne && selectedIds.length) > 0 ? (
                                <Grid xs ml={2} alignItems={'center'}>
                                    <Button
                                        sx={{ borderRadius: '25px' }}
                                        variant={'contained'}
                                        onClick={handlePayCommission}
                                    >
                                        Pay Selected
                                    </Button>
                                    <Button
                                        sx={{ marginLeft: '12px', borderRadius: '25px' }}
                                        variant={'outlined'}
                                        disabled
                                    >
                                        Archieved Selected
                                    </Button>
                                    <Button
                                        sx={{ marginLeft: '12px', borderRadius: '25px' }}
                                        variant={'outlined'}
                                        disabled
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
                                    disabled
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
                            <TableCell sx={{ fontSize: '12px' }} variant={'head'}>
                                <Checkbox
                                    color="primary"
                                    checked={allSelected}
                                    indeterminate={selectedIds.length > 0}
                                    onClick={handleSelectAll}
                                />
                                Name / ID
                            </TableCell>
                            <TableCell sx={{ fontSize: '12px' }} variant={'head'}>
                                Date Initiated
                            </TableCell>
                            <TableCell sx={{ fontSize: '12px' }} variant={'head'}>
                                Date Completed
                            </TableCell>
                            <TableCell sx={{ fontSize: '12px' }} variant={'head'}>
                                Payout Account
                            </TableCell>
                            <TableCell sx={{ fontSize: '12px' }} variant={'head'}>
                                Status
                            </TableCell>
                            <TableCell sx={{ fontSize: '12px' }} variant={'head'}>
                                Paid By
                            </TableCell>
                            <TableCell sx={{ fontSize: '12px' }} variant={'head'}>
                                Amount
                            </TableCell>
                            <TableCell sx={{ fontSize: '12px' }} variant={'head'} />
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
                                                onClick={() => handleRowClick(payout.id, payout.amount)}
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
                                            'h:mm:s A',
                                        )}`}{' '}
                                    </TableCell>
                                    <TableCell>
                                        {' '}
                                        {`${formatDate(payout.completedAt, 'MMM D, YYYY')} at ${formatDate(
                                            payout.completedAt,
                                            'h:mm:s A',
                                        )}`}{' '}
                                    </TableCell>
                                    <TableCell>{payout.payoutAccount}</TableCell>
                                    <TableCell>{payout.status?.name}</TableCell>
                                    <TableCell>{payout.paidBy.getFullName()}</TableCell>
                                    <TableCell>{payout.amount}</TableCell>
                                    <TableCell>
                                        {payout.status?.id === PayoutStatusEnum.PENDING ? (
                                            <Button
                                                onClick={() => handlePay(payout.id, payout.amount)}
                                                variant={'contained'}
                                            >
                                                Pay
                                            </Button>
                                        ) : null}
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
                    totalRecipient={selectedIds.length}
                    totalPayout={payoutTotal}
                />
            </Grid>
        </>
    );
}
