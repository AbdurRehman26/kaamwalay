import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { round } from 'lodash';
import moment from 'moment';
import { useEffect } from 'react';
import EnhancedTableHeadCell from '@shared/components/Tables/EnhancedTableHeadCell';
import { ReferralCommissionEarningsEntity } from '@shared/entities/ReferralCommissionEarningsEntity';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { toApiPropertiesObject } from '@shared/lib/utils/toApiPropertiesObject';
import { useListReferralCommissionEarningsQuery } from '@shared/redux/hooks/useReferralCommissionEarningsQuery';
import { useAppSelector } from '@dashboard/redux/hooks';
import EmptyStates from '../../EmptyStates';
import ReferralTable from '../../ReferralTable';

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

const headings: EnhancedTableHeadCell[] = [
    {
        id: 'customer',
        numeric: false,
        disablePadding: false,
        label: 'Customer',
        align: 'left',
        sortable: false,
    },
    {
        id: 'created_at',
        numeric: false,
        disablePadding: false,
        label: 'Date Paid',
        align: 'left',
        sortable: true,
    },
    {
        id: 'cards',
        numeric: true,
        disablePadding: false,
        label: 'Cards',
        align: 'right',
        sortable: false,
    },
    {
        id: 'submission_total',
        numeric: true,
        disablePadding: false,
        label: 'Submission Total',
        align: 'right',
        sortable: false,
    },
    {
        id: 'commission',
        numeric: true,
        disablePadding: false,
        label: 'Commission',
        align: 'right',
        sortable: false,
    },
];

export function CommissionEarnings() {
    const sortCommissionFilter = useAppSelector(
        (state) => state.referralProgramSlice.commissionEarningsFilter.commissionEarningFilter,
    );

    const commissionEarnings$ = useListReferralCommissionEarningsQuery({
        params: {
            sort: '-created_at',
        },

        ...bracketParams(),
    });

    const { data, paginationProps } = commissionEarnings$;

    useEffect(
        () => {
            if (!commissionEarnings$.isLoading) {
                commissionEarnings$.searchSortedWithPagination(
                    { sort: sortCommissionFilter ? 'created_at' : '-created_at' },
                    toApiPropertiesObject({}),
                    1,
                );
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [sortCommissionFilter],
    );

    if (data.length === 0 && commissionEarnings$.isLoading) {
        return <CircularProgress />;
    }

    const tableRows = data?.map((data: ReferralCommissionEarningsEntity) => (
        <TableRow key={data?.id}>
            <StyledTableCell>
                <Grid container alignItems={'center'}>
                    <Avatar src={data?.profileImage ?? ''}>{data?.getInitials()}</Avatar>
                    <Grid item xs container pl={2}>
                        <Typography sx={{ fontSize: '14px' }}>{data?.fullName}</Typography>
                    </Grid>
                </Grid>
            </StyledTableCell>
            <StyledTableCell>{data?.paidAt ? moment(data?.paidAt).format('lll') : '-'}</StyledTableCell>
            <StyledTableCell align={'right'}>{data?.cards}</StyledTableCell>
            <StyledTableCell align={'right'}>${round(data?.submissionTotal, 2).toFixed(2)}</StyledTableCell>
            <StyledTableCell align={'right'}>${round(data?.commission, 2).toFixed(2)}</StyledTableCell>
        </TableRow>
    ));

    return (
        <>
            {data.length === 0 ? (
                <EmptyStates
                    heading={'No Commission Earnings'}
                    description={'You haven’t earned any commission, yet.'}
                    icon={<MonetizationOnTwoToneIcon />}
                />
            ) : (
                <ReferralTable
                    heading={'Commission Earnings'}
                    tableHeadings={headings}
                    tableRows={tableRows}
                    count={data.length}
                    paginationProps={paginationProps}
                />
            )}
        </>
    );
}

export default CommissionEarnings;
