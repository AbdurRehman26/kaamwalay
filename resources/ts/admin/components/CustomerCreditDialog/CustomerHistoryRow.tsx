import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import TableRow from '@mui/material/TableRow';
import { Moment } from 'moment';

interface CustomerHistoryRowProps {
    date: Moment;
    description: string;
    amount: number;
}

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: CustomerHistoryRow
 * @date: 23.12.2021
 * @time: 19:45
 */
export function CustomerHistoryRow({ date, description, amount }: CustomerHistoryRowProps) {
    return (
        <TableRow>
            <TableCell>
                <Typography variant={'caption'}>{formatDate(date, 'MM/DD/YYYY')}</Typography>
            </TableCell>
            <TableCell>
                <Typography
                    variant={'caption'}
                    color={'textSecondary'}
                    className={'CustomerCreditDialog-customerDescription'}
                >
                    {description}
                </Typography>
            </TableCell>
            <TableCell align={'right'}>
                <Typography variant={'caption'} fontWeight={500}>
                    {formatCurrency(amount)}
                </Typography>
            </TableCell>
        </TableRow>
    );
}
