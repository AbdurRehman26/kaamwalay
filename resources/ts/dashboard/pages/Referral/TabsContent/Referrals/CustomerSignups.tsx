import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
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
import { ReferralCustomerSignUpsEntity } from '@shared/entities/ReferralCustomerSignUpsEntity';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { toApiPropertiesObject } from '@shared/lib/utils/toApiPropertiesObject';
import { useListReferralCustomerSignUpsQuery } from '@shared/redux/hooks/useReferralCustomerSignUpsQuery';
import { useAppSelector } from '@dashboard/redux/hooks';
import { setCustomerSignUpsFilter } from '@dashboard/redux/slices/referralProgramSlice';
import EmptyStates from '../../EmptyStates';
import ListingTable from '../../ListingTable';

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
        label: 'Signed up',
        align: 'left',
        sortable: true,
    },
    {
        id: 'total_cards',
        numeric: false,
        disablePadding: false,
        label: 'Tot. Cards',
        align: 'right',
        sortable: false,
    },
    {
        id: 'submissions',
        numeric: true,
        disablePadding: false,
        label: 'Submissions',
        align: 'right',
        sortable: false,
    },
    {
        id: 'total_spent',
        numeric: true,
        disablePadding: false,
        label: 'Tot. Spent',
        align: 'right',
        sortable: false,
    },
    {
        id: 'total_commission',
        numeric: true,
        disablePadding: false,
        label: 'Tot. Commission',
        align: 'right',
        sortable: false,
    },
];

export function CustomerSignups() {
    const sortSignUpsFilter = useAppSelector((state) => state.referralProgramSlice.customerSignUpsFilter.signUpsfilter);

    const customerSignup$ = useListReferralCustomerSignUpsQuery({
        params: {
            sort: '-created_at',
        },

        ...bracketParams(),
    });

    const { data, paginationProps } = customerSignup$;

    useEffect(
        () => {
            if (!customerSignup$.isLoading) {
                customerSignup$.searchSortedWithPagination(
                    { sort: sortSignUpsFilter ? 'created_at' : '-created_at' },
                    toApiPropertiesObject({}),
                    1,
                );
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [sortSignUpsFilter],
    );

    if (data.length === 0 && customerSignup$.isLoading) {
        return <CircularProgress />;
    }

    const dispatchData = setCustomerSignUpsFilter(!sortSignUpsFilter);

    const tableRows = data?.map((data: ReferralCustomerSignUpsEntity) => (
        <TableRow key={data?.id}>
            <StyledTableCell>
                <Grid container alignItems={'center'}>
                    <Avatar src={data?.profileImage ?? ''}>{data?.getInitials()}</Avatar>
                    <Grid item xs container pl={2}>
                        <Typography sx={{ fontSize: '14px' }}>{data?.fullName}</Typography>
                    </Grid>
                </Grid>
            </StyledTableCell>
            <StyledTableCell>{data?.signedUpAt ? moment(data?.signedUpAt).format('lll') : '-'}</StyledTableCell>
            <StyledTableCell align={'right'}>{data?.cardsCount}</StyledTableCell>
            <StyledTableCell align={'right'}>{data?.submissions}</StyledTableCell>
            <StyledTableCell align={'right'}>${round(data?.totalSpent, 2).toFixed(2)}</StyledTableCell>
            <StyledTableCell align={'right'}>${round(data?.totalCommissions, 2).toFixed(2)}</StyledTableCell>
        </TableRow>
    ));

    return (
        <>
            {data.length === 0 ? (
                <EmptyStates
                    heading={'No Customer Sign Ups'}
                    description={'You haven’t gotten any customers to sign up, yet.'}
                    icon={<AccountCircleTwoToneIcon />}
                />
            ) : (
                <ListingTable
                    heading={'Customer Sign Ups'}
                    tableHeadings={headings}
                    tableRows={tableRows}
                    count={data.length}
                    paginationProps={paginationProps}
                    dispatchData={dispatchData}
                />
            )}
        </>
    );
}

export default CustomerSignups;
