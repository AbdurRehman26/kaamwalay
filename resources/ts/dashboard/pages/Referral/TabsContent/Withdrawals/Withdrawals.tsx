import EnhancedTableHeadCell from '@shared/components/Tables/EnhancedTableHeadCell';
import ReferralTable from '../Referrals/ReferralTable';

const headings: EnhancedTableHeadCell[] = [
    {
        id: 'date_initiated',
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

export function Withdrawals() {
    return <ReferralTable tableData={rows} heading={'Withdrawals'} tableHeadings={headings} />;
}

export default Withdrawals;
