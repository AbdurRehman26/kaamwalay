import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { round } from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import EnhancedTableHead from '@shared/components/Tables/EnhancedTableHead';
import { TableSortType } from '@shared/constants/TableSortType';
import { ReferralCommissionEarningsEntity } from '@shared/entities/ReferralCommissionEarningsEntity';
import { ReferralCustomerSignUpsEntity } from '@shared/entities/ReferralCustomerSignUpsEntity';
import { useAppSelector } from '@dashboard/redux/hooks';
import { setCommissionEarningsFilter, setCustomerSignUpsFilter } from '@dashboard/redux/slices/referralProgramSlice';

const StyledTableCell = styled(TableCell)({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#F9F9F9;',
        fontWeight: 500,
        fontSize: '10px',
        lineHeight: '16px',
        letterSpacing: '0.75px',
        textTransform: 'uppercase',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    [`&.${tableCellClasses.body}`]: {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
        '&:last-child': {
            fontWeight: 700,
            color: '#20BFB8',
        },
    },
});

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
    tableData: any;
    heading: string;
    tableHeadings: any;
    isCustomerSignup?: boolean;
}

export function ReferralTable({ tableData, heading, tableHeadings, isCustomerSignup }: props) {
    const [order, setOrder] = useState<TableSortType>('desc');
    const [orderBy, setOrderBy] = useState<string>('created_at');
    const { data, paginationProps } = tableData;
    const sortCustomerSignUpFilter = useAppSelector(
        (state) => state.referralProgramSlice.customerSignUpsFilter.signUpsfilter,
    );
    const sortCommissionEarningsFilter = useAppSelector(
        (state) => state.referralProgramSlice.commissionEarningsFilter.commissionEarningFilter,
    );
    const dispatch = useDispatch();

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        if (isCustomerSignup) {
            dispatch(setCustomerSignUpsFilter(!sortCustomerSignUpFilter));
        } else {
            dispatch(setCommissionEarningsFilter(!sortCommissionEarningsFilter));
        }
    };

    return (
        <StyledTableContainer>
            <Grid sx={{ minWidth: 800 }}>
                <Typography className={'TableHeading'}>
                    {heading} ({data?.length})
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
                <TableBody>
                    {isCustomerSignup
                        ? data?.map((data: ReferralCustomerSignUpsEntity) => (
                              <TableRow key={data?.id}>
                                  <StyledTableCell>
                                      <Grid container alignItems={'center'}>
                                          <Avatar src={data?.profileImage ?? ''}>{data?.getInitials()}</Avatar>
                                          <Grid item xs container pl={2}>
                                              <Typography sx={{ fontSize: '14px' }}>{data?.fullName}</Typography>
                                          </Grid>
                                      </Grid>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                      {data?.signedUpAt ? moment(data?.signedUpAt).format('lll') : '-'}
                                  </StyledTableCell>
                                  <StyledTableCell align={'right'}>{data?.cardsCount}</StyledTableCell>
                                  <StyledTableCell align={'right'}>{data?.submissions}</StyledTableCell>
                                  <StyledTableCell align={'right'}>
                                      ${round(data?.totalSpent, 2).toFixed(2)}
                                  </StyledTableCell>
                                  <StyledTableCell align={'right'}>
                                      ${round(data?.totalCommissions, 2).toFixed(2)}
                                  </StyledTableCell>
                              </TableRow>
                          ))
                        : data?.map((data: ReferralCommissionEarningsEntity) => (
                              <TableRow key={data?.id}>
                                  <StyledTableCell>
                                      <Grid container alignItems={'center'}>
                                          <Avatar src={data?.profileImage ?? ''}>{data?.getInitials()}</Avatar>
                                          <Grid item xs container pl={2}>
                                              <Typography sx={{ fontSize: '14px' }}>{data?.fullName}</Typography>
                                          </Grid>
                                      </Grid>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                      {data?.paidAt ? moment(data?.paidAt).format('lll') : '-'}
                                  </StyledTableCell>
                                  <StyledTableCell align={'right'}>{data?.cards}</StyledTableCell>
                                  <StyledTableCell align={'right'}>
                                      ${round(data?.submissionTotal, 2).toFixed(2)}
                                  </StyledTableCell>
                                  <StyledTableCell align={'right'}>
                                      ${round(data?.commission, 2).toFixed(2)}
                                  </StyledTableCell>
                              </TableRow>
                          ))}
                </TableBody>
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
