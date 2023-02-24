import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { TablePagination } from '@shared/components/TablePagination';
import EnhancedTableHead from '@shared/components/Tables/EnhancedTableHead';
import { PayoutStatusEnum } from '@shared/constants/PayoutStatusEnum';
import { TableSortType } from '@shared/constants/TableSortType';
import { PayoutEntity } from '@shared/entities/PayoutEntity';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { payReferralCommissions } from '@shared/redux/slices/adminReferralPayoutSlice';
import { useAppDispatch } from '@admin/redux/hooks';

interface CustomerPayoutListingProps {
    payouts: PayoutEntity[];
    paginationProp?: any;
    headings: Array<any>;
    orderDirection?: TableSortType;
    orderBy?: string;
    handleRequestSort?: any | null;
    isSignUp?: boolean;
}

const styles = {
    tableBody: {
        background: '#FFFFFF',
    },
};

export function CustomerPayoutListing({
    payouts,
    paginationProp,
    headings,
    orderBy = '',
    orderDirection = 'desc',
    handleRequestSort,
}: CustomerPayoutListingProps) {
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const handlePayCommission = async (payoutId: number) => {
        setLoading(true);
        await dispatch(payReferralCommissions({ items: [payoutId] }));
        window.location.reload();
        setLoading(false);
    };

    return (
        <Table>
            <EnhancedTableHead
                onRequestSort={handleRequestSort}
                order={orderDirection}
                orderBy={orderBy}
                headCells={headings}
                hasStyling={true}
            />
            <TableBody sx={styles.tableBody}>
                {payouts!.length > 0 ? (
                    payouts?.map((payout) => (
                        <TableRow>
                            <TableCell>
                                {`${formatDate(payout.createdAt, 'MMM D, YYYY')} at ${formatDate(
                                    payout.createdAt,
                                    'h:mm: A',
                                )}`}
                            </TableCell>
                            <TableCell>
                                {payout.completedAt
                                    ? `${formatDate(payout.completedAt, 'MMM D, YYYY')} at ${formatDate(
                                          payout.completedAt,
                                          'h:mm: A',
                                      )}`
                                    : '-'}
                            </TableCell>
                            <TableCell>{payout.payoutAccount}</TableCell>
                            <TableCell>{payout.status.name}</TableCell>
                            <TableCell>{payout?.paidBy?.getFullName()}</TableCell>
                            <TableCell>{formatCurrency(payout.amount)}</TableCell>
                            <TableCell>
                                {payout.status.id === PayoutStatusEnum.PENDING ? (
                                    <LoadingButton
                                        loading={loading}
                                        variant={'contained'}
                                        onClick={() => handlePayCommission(payout.id)}
                                    >
                                        Pay
                                    </LoadingButton>
                                ) : null}
                            </TableCell>
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
                    <TablePagination {...paginationProp} />
                </TableRow>
            </TableFooter>
        </Table>
    );
}

export default CustomerPayoutListing;
