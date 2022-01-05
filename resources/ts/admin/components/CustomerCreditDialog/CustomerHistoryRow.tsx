import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import TableRow from '@mui/material/TableRow';
import { Moment } from 'moment';

export enum CustomerHistoryAction {
    Added,
    Used,
}

interface Props {
    date: Moment;
    displayName: string;
    action: CustomerHistoryAction;
    amount: number;
}

const ACTIONS: Record<CustomerHistoryAction, string> = {
    [CustomerHistoryAction.Added]: 'added to their wallet.',
    [CustomerHistoryAction.Used]: 'used credit on a submission.',
};

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: CustomerHistoryRow
 * @date: 23.12.2021
 * @time: 19:45
 */
export function CustomerHistoryRow({ date, action, displayName, amount }: Props) {
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
                    <span>{displayName}</span> {ACTIONS[action] ?? ''}
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
