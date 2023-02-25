import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { PayoutStatusEnum } from '@shared/constants/PayoutStatusEnum';
import { PayoutEntity } from '@shared/entities/PayoutEntity';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { toApiPropertiesObject } from '@shared/lib/utils/toApiPropertiesObject';
import { useAdminReferralPayoutsQuery } from '@shared/redux/hooks/useAdminReferralPayoutsQuery';
import { payReferralCommissions } from '@shared/redux/slices/adminReferralPayoutSlice';
import { useAppDispatch } from '@admin/redux/hooks';
import PayoutCommissionDialog from './PayoutCommissionDialog';

interface ReferralProgramPayoutTableProps {
    tabFilter?: PayoutStatusEnum;
    all?: boolean;
    search?: string;
}

const styles = {
    headingText: {
        color: '#000000DE',
        fontWeight: 400,
        fontSize: '16px',
    },
    buttonStyle: {
        marginLeft: '12px',
        borderRadius: '25px',
    },
    exportButton: {
        borderRadius: 20,
        padding: '7px 24px',
    },
    tableCellText: {
        fontSize: '12px',
    },
    sortHoverState: {
        '&:hover': {
            cursor: 'pointer',
        },
    },
};

export function ReferralProgramPayoutTable({ search, all, tabFilter }: ReferralProgramPayoutTableProps) {
    const [sortFilter, setSortFilter] = useState('-created_at');
    const [sortCreatedAt, setSortCreatedAt] = useState(false);
    const [sortCompletedAt, setSortCompletedAt] = useState(false);
    const [sortAccount, setSortAccount] = useState(false);
    const [sortAmount, setSortAmount] = useState(false);

    const [payoutTotal, setPayoutTotal] = useState(0);
    const [isPayOne, setIsPayOne] = useState(false);
    const [isSearchEnabled, setIsSearchEnabled] = useState(false);
    const [allSelected, setAllSelected] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showPayoutCommission, setShowPayoutCommission] = useState(false);

    const dispatch = useAppDispatch();

    const payouts = useAdminReferralPayoutsQuery({
        params: {
            filter: {
                search: search,
                referrerPayoutStatusId: tabFilter,
            },
        },
        ...bracketParams(),
    });

    const calculateTotal = () => {
        const data: number[] = [];
        payouts.data
            .filter((payout: PayoutEntity) =>
                selectedIds.find((id) => id === payout.id && payout.status.id === PayoutStatusEnum.PENDING),
            )
            .map((payout: PayoutEntity) => {
                data.push(parseFloat(payout.amount.toString()));
            });
        setPayoutTotal(data.reduce((a, b) => a + b, 0));
    };

    const handlePayCommission = () => {
        calculateTotal();
        setShowPayoutCommission(true);
    };

    useEffect(
        () => {
            if (!payouts.isLoading && isSearchEnabled) {
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

    const handleCommissions = async () => {
        await dispatch(payReferralCommissions({ items: selectedIds }));
        window.location.reload();
    };

    const handleDialogClose = () => {
        setPayoutTotal(0);
        setSelectedIds([]);
        setShowPayoutCommission(false);
        setIsPayOne(false);
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
        setPayoutTotal(amount);
        setShowPayoutCommission(true);
    };

    const handleSortAccount = (value: boolean, property: string) => {
        setSortAccount(value);
        setSortFilter(value ? `${property}` : `-${property}`);
    };

    const handleSortAmount = (value: boolean, property: string) => {
        setSortAmount(value);
        setSortFilter(value ? `${property}` : `-${property}`);
    };

    const handleSortCreatedAt = (value: boolean, property: string) => {
        setSortCreatedAt(value);
        setSortFilter(value ? `${property}` : `-${property}`);
    };

    const handleSortCompletedAt = (value: boolean, property: string) => {
        setSortCompletedAt(value);
        setSortFilter(value ? `${property}` : `-${property}`);
    };

    const isSelected = (selectedRowId: number) => selectedIds.indexOf(selectedRowId) !== -1;

    return (
        <>
            {payouts.isLoading ? (
                <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container direction={'column'}>
                    <Grid container pt={2.5} px={2} pb={2} justifyContent={'flex-start'}>
                        <>
                            <Grid item xs container alignItems={'center'}>
                                {selectedIds.length === 0 ? (
                                    <Typography sx={styles.headingText}>
                                        {payouts.data.length > 0 ? `${payouts.data.length} Results` : null}
                                    </Typography>
                                ) : (
                                    <Typography sx={styles.headingText}>{`${selectedIds.length} Selected `}</Typography>
                                )}
                                {(!isPayOne && selectedIds.length) > 0 ? (
                                    <Grid xs ml={2} alignItems={'center'}>
                                        <Button
                                            disabled={tabFilter !== PayoutStatusEnum.PENDING}
                                            sx={styles.buttonStyle}
                                            variant={'contained'}
                                            onClick={handlePayCommission}
                                        >
                                            Pay Selected
                                        </Button>
                                        <Button sx={styles.buttonStyle} variant={'outlined'} disabled>
                                            Archieved Selected
                                        </Button>
                                        <Button sx={styles.buttonStyle} variant={'outlined'} disabled>
                                            Export Selected
                                        </Button>
                                    </Grid>
                                ) : null}
                            </Grid>
                            {selectedIds.length === 0 ? (
                                <Grid item xs container justifyContent={'flex-end'} maxWidth={'240px !important'}>
                                    <Button variant={'outlined'} color={'primary'} sx={styles.exportButton} disabled>
                                        Export List
                                    </Button>
                                </Grid>
                            ) : null}
                        </>
                    </Grid>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={styles.tableCellText} variant={'head'}>
                                    <Checkbox
                                        color="primary"
                                        checked={allSelected}
                                        indeterminate={selectedIds.length > 0}
                                        onClick={handleSelectAll}
                                    />
                                    Name / ID
                                </TableCell>
                                <TableCell
                                    onClick={() => handleSortCreatedAt(!sortCreatedAt, 'created_at')}
                                    sx={[styles.tableCellText, styles.sortHoverState]}
                                    variant={'head'}
                                >
                                    Date Initiated
                                    <TableSortLabel
                                        direction={!sortCreatedAt ? 'desc' : 'asc'}
                                        active={true}
                                    ></TableSortLabel>
                                </TableCell>
                                <TableCell
                                    onClick={() => handleSortCompletedAt(!sortCompletedAt, 'completed_at')}
                                    sx={[styles.tableCellText, styles.sortHoverState]}
                                    variant={'head'}
                                >
                                    Date Completed
                                    <TableSortLabel
                                        direction={!sortCompletedAt ? 'desc' : 'asc'}
                                        active={true}
                                    ></TableSortLabel>
                                </TableCell>
                                <TableCell
                                    onClick={() => handleSortAccount(!sortAccount, 'payout_account')}
                                    sx={[styles.tableCellText, styles.sortHoverState]}
                                    variant={'head'}
                                >
                                    Payout Account
                                    <TableSortLabel
                                        direction={!sortAccount ? 'desc' : 'asc'}
                                        active={true}
                                    ></TableSortLabel>
                                </TableCell>
                                <TableCell sx={styles.tableCellText} variant={'head'}>
                                    Status
                                </TableCell>
                                <TableCell sx={styles.tableCellText} variant={'head'}>
                                    Paid By
                                </TableCell>
                                <TableCell
                                    onClick={() => handleSortAmount(!sortAmount, 'amount')}
                                    sx={[styles.tableCellText, styles.sortHoverState]}
                                    variant={'head'}
                                >
                                    Amount
                                    <TableSortLabel
                                        direction={!sortAmount ? 'desc' : 'asc'}
                                        active={true}
                                    ></TableSortLabel>
                                </TableCell>
                                <TableCell sx={styles.tableCellText} variant={'head'} />
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
                                                    <Typography variant={'body2'}>{payout.user?.fullName}</Typography>
                                                    <Typography variant={'caption'} color={'textSecondary'}>
                                                        {payout.user.customerNumber}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </TableCell>
                                        <TableCell>
                                            {`${formatDate(payout.createdAt, 'MMM D, YYYY')} at ${formatDate(
                                                payout.createdAt,
                                                'h:mm A',
                                            )}`}
                                        </TableCell>
                                        <TableCell>
                                            {payout.completedAt
                                                ? `${formatDate(payout.completedAt, 'MMM D, YYYY')} at ${formatDate(
                                                      payout.completedAt,
                                                      'h:mm A',
                                                  )}`
                                                : '-'}
                                        </TableCell>
                                        <TableCell>{payout.payoutAccount}</TableCell>
                                        <TableCell>
                                            {payout.status?.id === PayoutStatusEnum.PENDING ||
                                            payout.status?.id === PayoutStatusEnum.PROCESSING
                                                ? 'Pending'
                                                : payout.status?.name}
                                        </TableCell>
                                        <TableCell>{payout?.paidBy?.getFullName()}</TableCell>
                                        <TableCell>{payout.amount}</TableCell>
                                        <TableCell>
                                            {payout.status?.id === PayoutStatusEnum.PENDING &&
                                            selectedIds.length < 2 ? (
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
                        onSubmit={() => handleCommissions()}
                        onClose={() => {
                            handleDialogClose();
                        }}
                        open={showPayoutCommission && selectedIds.length > 0}
                        totalRecipient={selectedIds.length}
                        totalPayout={payoutTotal}
                    />
                </Grid>
            )}
        </>
    );
}
