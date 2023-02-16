import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';
import EnhancedTableHeadCell from '@shared/components/Tables/EnhancedTableHeadCell';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { toApiPropertiesObject } from '@shared/lib/utils/toApiPropertiesObject';
import { useListReferralCommissionEarningsQuery } from '@shared/redux/hooks/useReferralCommissionEarningsQuery';
import { useAppSelector } from '@dashboard/redux/hooks';
import EmptyStates from './EmptyStates';
import ReferralTable from './ReferralTable';

import CircularProgress from '@mui/material/CircularProgress';
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

    if (commissionEarnings$.data.length === 0 && commissionEarnings$.isLoading) {
        return <CircularProgress />;
    }

    return (
        <>
            {commissionEarnings$.data.length === 0 ? (
                <EmptyStates
                    heading={'No Commission Earnings'}
                    description={'You haven’t earned any commission, yet.'}
                    icon={<MonetizationOnTwoToneIcon />}
                />
            ) : (
                <ReferralTable
                    tableData={commissionEarnings$}
                    heading={'Commission Earnings'}
                    tableHeadings={headings}
                />
            )}
        </>
    );
}

export default CommissionEarnings;
