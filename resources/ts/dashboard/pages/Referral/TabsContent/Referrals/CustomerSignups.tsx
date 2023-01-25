import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import EnhancedTableHeadCell from '@shared/components/Tables/EnhancedTableHeadCell';
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

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export function CustomerSignups() {
    return (
        <>
            <EmptyStates
                heading={'No Customer Sign Ups'}
                description={'You haven’t gotten any customers to sign up, yet.'}
                icon={<AccountCircleTwoToneIcon />}
            />
            <ReferralTable data={rows} heading={'Customer Sign Ups'} tableHeading={headings} isCustomerSignup />
        </>
    );
}

export default CustomerSignups;
