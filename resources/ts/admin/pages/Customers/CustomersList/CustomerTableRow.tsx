import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { MouseEventHandler, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OptionsMenu, OptionsMenuItem } from '@shared/components/OptionsMenu';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { UserEntity } from '@shared/entities/UserEntity';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { nameInitials } from '@shared/lib/strings/initials';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';

interface CustomerTableRowProps {
    customerData: CustomerEntity;
}

enum RowOption {
    CreditCustomer,
}

const styles = {
    TableRow: {
        '&:hover': {
            cursor: 'pointer',
            background: '#F9F9F9',
        },
    },
};

export function CustomerTableRow(props: CustomerTableRowProps) {
    const { customerData } = props;
    const [customer, setCustomer] = useState<UserEntity | null>(null);
    const customerViewUrl = `/customers/${customerData.id}/view`;
    const navigate = useNavigate();

    const handleOption = useCallback((action: RowOption, value?: any) => {
        switch (action) {
            case RowOption.CreditCustomer:
                const [firstName, lastName] = value.fullName.split(' ');
                const user = new UserEntity();
                user.id = value.id;
                user.firstName = firstName;
                user.lastName = lastName;
                user.wallet = value.wallet;
                setCustomer(user);
                break;
        }
    }, []);

    const handleRowClick = useCallback<MouseEventHandler>(
        (e) => {
            if ((e.target as Element).getAttribute('aria-hidden') !== 'true') {
                navigate(customerViewUrl);
            }
        },
        [navigate, customerViewUrl],
    );

    return (
        <TableRow key={customerData.id} onClick={handleRowClick} sx={styles.TableRow}>
            <TableCell variant={'body'}>
                <Grid container>
                    <Avatar src={customerData.profileImage ?? ''}>{nameInitials(customerData.fullName)}</Avatar>
                    <Grid item xs container direction={'column'} pl={2}>
                        <Typography variant={'body2'}>{customerData.customerNumber}</Typography>
                        <Typography variant={'caption'} color={'textSecondary'}>
                            {customerData.customerNumber}
                        </Typography>
                    </Grid>
                </Grid>
            </TableCell>
            <TableCell variant={'body'}>{customerData.email ?? '-'}</TableCell>
            <TableCell variant={'body'}>{customerData.phone ?? '-'}</TableCell>
            <TableCell variant={'body'}>{formatDate(customerData.createdAt, 'MM/DD/YYYY')}</TableCell>
            <TableCell variant={'body'} align={'right'}>
                {customerData.submissions ?? 0}
            </TableCell>
            <TableCell variant={'body'} align={'right'}>
                {customerData.cardsCount}
            </TableCell>
            <TableCell variant={'body'} align={'right'}>
                {formatCurrency(customerData.wallet?.balance ?? 0)}
            </TableCell>
            <TableCell variant={'body'} align={'right'}>
                <OptionsMenu onClick={handleOption}>
                    <OptionsMenuItem action={RowOption.CreditCustomer} value={customer}>
                        Credit Customer
                    </OptionsMenuItem>
                </OptionsMenu>
            </TableCell>
        </TableRow>
    );
}
