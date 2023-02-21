import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import EnhancedTableHead from '@shared/components/Tables/EnhancedTableHead';
import { TableSortType } from '@shared/constants/TableSortType';
import { useAppSelector } from '@dashboard/redux/hooks';
import {
    setCommissionEarningsFilter,
    setCustomerSignUpsFilter,
    setWithdrawFilter,
} from '@dashboard/redux/slices/referralProgramSlice';

const StyledTableContainer = styled(TableContainer)({
    margin: '20px 0px',
    border: '1px solid #E0E0E0',
    borderRadius: '3px 3px 0px 0px',
    '.TableHeading': {
        background: '#F9F9F9',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '20px 15px',
    },
});

interface props {
    heading: string;
    tableHeadings: any;
    isCustomerSignup?: boolean;
    isWithdrawl?: boolean;
    tableRows: any;
    count: number;
    paginationProps: any;
}

export function ReferralTable({
    heading,
    tableHeadings,
    isCustomerSignup,
    isWithdrawl,
    tableRows,
    count,
    paginationProps,
}: props) {
    const [order, setOrder] = useState<TableSortType>('desc');
    const [orderBy, setOrderBy] = useState<string>('created_at');

    const sortCustomerSignUpFilter = useAppSelector(
        (state) => state.referralProgramSlice.customerSignUpsFilter.signUpsfilter,
    );
    const sortCommissionEarningsFilter = useAppSelector(
        (state) => state.referralProgramSlice.commissionEarningsFilter.commissionEarningFilter,
    );
    const sortWithdrawFilter = useAppSelector((state) => state.referralProgramSlice.withdrawFilter.withdraw);
    const dispatch = useDispatch();

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        if (isCustomerSignup) {
            dispatch(setCustomerSignUpsFilter(!sortCustomerSignUpFilter));
        } else if (isWithdrawl) {
            dispatch(setWithdrawFilter(!sortWithdrawFilter));
        } else {
            dispatch(setCommissionEarningsFilter(!sortCommissionEarningsFilter));
        }
    };

    return (
        <StyledTableContainer>
            <Grid sx={{ minWidth: 800 }}>
                <Typography className={'TableHeading'}>
                    {heading} ({count})
                </Typography>
            </Grid>
            <Table sx={{ minWidth: 800 }}>
                <EnhancedTableHead
                    onRequestSort={handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                    headCells={tableHeadings}
                    isReferral
                />
                <TableBody>{tableRows}</TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            sx={{
                                background: '#F9F9F9',
                                borderRadius: '0px 0px 3px 3px',
                            }}
                            {...paginationProps}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </StyledTableContainer>
    );
}

export default ReferralTable;
