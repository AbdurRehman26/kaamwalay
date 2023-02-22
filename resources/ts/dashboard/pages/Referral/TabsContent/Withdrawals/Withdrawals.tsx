import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { round } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
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

const styles = {
    SnackBarDiv: {
        background: '#43A047',
        borderRadius: '4px',
        padding: '15px 25px',
        boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.2)',
        width: '360px',
        top: '65px!important',
    },
    SnackBarTitle: {
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: '#FFFFFF',
        marginLeft: '10px',
    },
    SnackBarIcon: {
        color: '#fff',
    },
    SnackBarContentDiv: {
        display: 'flex',
    },
};

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
        id: 'completed_at',
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
        align: 'left',
        sortable: false,
    },
    {
        id: 'status',
        numeric: true,
        disablePadding: false,
        label: 'STATUS',
        align: 'left',
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
    const [isSnackbarShow, setIsSnackbarShow] = useState(localStorage.getItem('referral-program-snackbar:show'));

    const withdraw$ = useListReferralWithdrawQuery({
        params: {
            sort: '-created_at',
        },

        ...bracketParams(),
    });

    useEffect(() => {
        if (isSnackbarShow === 'true') {
            setTimeout(() => {
                localStorage.setItem('referral-program-snackbar:show', 'false');
                setIsSnackbarShow(localStorage.getItem('referral-program-snackbar:show'));
            }, 1000);
        }
    }, [isSnackbarShow]);

    const { data, paginationProps } = withdraw$;

    useEffect(
        () => {
            if (!withdraw$.isLoading) {
                withdraw$.searchSortedWithPagination(
                    { sort: sortWithdrawFilter ? 'created_at' : '-created_at' },
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
            <StyledTableCell>{data?.createdAt ? moment(data?.createdAt).format('lll') : '-'}</StyledTableCell>
            <StyledTableCell>{data?.completedAt ? moment(data?.completedAt).format('lll') : '-'}</StyledTableCell>
            <StyledTableCell align={'left'}>{data?.payoutAccount}</StyledTableCell>
            <StyledTableCell align={'left'}>{data?.status}</StyledTableCell>
            <StyledTableCell align={'right'}>${round(data?.amount, 2).toFixed(2)}</StyledTableCell>
        </TableRow>
    ));
    return (
        <>
            <Snackbar
                open={isSnackbarShow === 'true' ? true : false}
                sx={styles.SnackBarDiv}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Grid sx={styles.SnackBarContentDiv}>
                    <DoneOutlinedIcon sx={styles.SnackBarIcon} />
                    <Typography sx={styles.SnackBarTitle}>Withdrawal successfully initiated</Typography>
                </Grid>
            </Snackbar>
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
                    isWithdrawl={true}
                />
            )}
        </>
    );
}

export default Withdrawals;
