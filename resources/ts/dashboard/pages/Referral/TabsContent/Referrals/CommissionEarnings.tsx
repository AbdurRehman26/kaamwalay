import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
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

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Alban Toci', 159, 6.0, 24, 4.0),
    createData('Alban Toci', 237, 9.0, 37, 4.3),
    createData('Alban Toci', 262, 16.0, 24, 6.0),
    createData('Alban Toci', 305, 3.7, 67, 4.3),
    createData('Alban Toci', 356, 16.0, 49, 3.9),
];

export function CommissionEarnings() {
    return (
        <>
            <EmptyStates
                heading={'No Commission Earnings'}
                description={'You haven’t earned any commission, yet.'}
                icon={<MonetizationOnTwoToneIcon />}
            />
            <ReferralTable data={rows} heading={'Commission Earnings'} tableHeading={headings} />
        </>
    );
}

export default CommissionEarnings;
