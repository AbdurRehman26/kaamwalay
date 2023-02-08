import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import EnhancedTableHeadCell from '@shared/components/Tables/EnhancedTableHeadCell';
import { useListReferralCommissionEarningsQuery } from '@shared/redux/hooks/useReferralCommissionEarningsQuery';
import EmptyStates from './EmptyStates';
import ReferralTable from './ReferralTable';

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
    const commissionEarnings$ = useListReferralCommissionEarningsQuery({});

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
                    tableHeading={headings}
                />
            )}
        </>
    );
}

export default CommissionEarnings;
