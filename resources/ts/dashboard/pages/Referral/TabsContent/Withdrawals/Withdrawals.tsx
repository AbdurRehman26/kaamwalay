import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { round } from 'lodash';
import moment from 'moment';
import { useEffect } from 'react';
import EnhancedTableHeadCell from '@shared/components/Tables/EnhancedTableHeadCell';
import { ReferralWithdrawEntity } from '@shared/entities/ReferralWithdrawEntity';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { toApiPropertiesObject } from '@shared/lib/utils/toApiPropertiesObject';
import { useListReferralWithdrawQuery } from '@shared/redux/hooks/useReferralWithdrawQuery';
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
        id: 'created_at',
        numeric: false,
        disablePadding: false,
        label: 'DATE INITIATED',
        align: 'left',
        sortable: true,
    },
    {
        id: 'date_created',
        numeric: false,
        disablePadding: false,
        label: 'DATE COMPLETED',
        align: 'left',
        sortable: false,
    },
    {
        id: 'payout_account',
        numeric: true,
        disablePadding: false,
        label: 'PAYOUT ACCOUNT',
        align: 'right',
        sortable: false,
    },
    {
        id: 'status',
        numeric: true,
        disablePadding: false,
        label: 'STATUS',
        align: 'right',
        sortable: false,
    },
    {
        id: 'amount',
        numeric: true,
        disablePadding: false,
        label: 'AMOUNT',
        align: 'right',
        sortable: false,
    },
];

export function Withdrawals() {
    const sortWithdrawFilter = useAppSelector((state) => state.referralProgramSlice.withdrawFilter.withdraw);

    const withdraw$ = useListReferralWithdrawQuery({
        params: {
            sort: '-initiated_at',
        },

        ...bracketParams(),
    });

    const { data, paginationProps } = withdraw$;

    useEffect(
        () => {
            if (!withdraw$.isLoading) {
                withdraw$.searchSortedWithPagination(
                    { sort: sortWithdrawFilter ? 'initiated_at' : '-initiated_at' },
                    toApiPropertiesObject({}),
                    1,
                );
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [sortWithdrawFilter],
    );

    if (withdraw$.data.length === 0 && withdraw$.isLoading) {
        return <CircularProgress />;
    }
    const tableRows = data?.map((data: ReferralWithdrawEntity) => (
        <TableRow key={data?.id}>
            <StyledTableCell>{data?.dateInitiated ? moment(data?.dateInitiated).format('lll') : '-'}</StyledTableCell>
            <StyledTableCell>{data?.completedAt ? moment(data?.completedAt).format('lll') : '-'}</StyledTableCell>
            <StyledTableCell align={'right'}>{data?.payoutAccount}</StyledTableCell>
            <StyledTableCell align={'right'}>{data?.status}</StyledTableCell>
            <StyledTableCell align={'right'}>${round(data?.amount, 2).toFixed(2)}</StyledTableCell>
        </TableRow>
    ));
    return (
        <>
            {withdraw$.data.length === 0 ? (
                <EmptyStates
                    heading={'No Withdrawals'}
                    description={'You haven’t withdrawn any money, yet.'}
                    icon={<CurrencyExchangeOutlinedIcon />}
                />
            ) : (
                <ReferralTable
                    heading={'Withdrawals'}
                    tableHeadings={headings}
                    tableRows={tableRows}
                    count={data.length}
                    paginationProps={paginationProps}
                />
            )}
        </>
    );
}

export default Withdrawals;
