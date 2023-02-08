import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import EnhancedTableHeadCell from '@shared/components/Tables/EnhancedTableHeadCell';
import { useListReferralQuery } from '@shared/redux/hooks/useReferralQuery';
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
    const customerSignup$ = useListReferralQuery({});

    return (
        <>
            <EmptyStates
                heading={'No Customer Sign Ups'}
                description={'You haven’t gotten any customers to sign up, yet.'}
                icon={<AccountCircleTwoToneIcon />}
            />
            <ReferralTable
                tableData={customerSignup$}
                heading={'Customer Sign Ups'}
                tableHeading={headings}
                isCustomerSignup
            />
        </>
    );
}

export default CustomerSignups;
