import MoreIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { MouseEvent, MouseEventHandler, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { nameInitials } from '@shared/lib/strings/initials';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { CustomerCreditDialog } from '@admin/components/CustomerCreditDialog';

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
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const [creditDialog, setCreditDialog] = useState(false);
    const customerViewUrl = `/customers/${customerData.id}/view`;
    const navigate = useNavigate();

    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);
    const handleCreditDialogClose = useCallback(() => setCreditDialog(false), []);

    const handleClickOptions = useCallback<MouseEventHandler>(
        (e) => {
            e.stopPropagation();
            setAnchorEl(e.target as Element);
        },
        [setAnchorEl],
    );

    const handleOption = useCallback(
        (option: RowOption) => async (e: MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            handleCloseOptions();
            switch (option) {
                case RowOption.CreditCustomer:
                    setCreditDialog(true);
                    break;
            }
        },
        [handleCloseOptions],
    );

    const handleRowClick = useCallback<MouseEventHandler>(
        (e) => {
            if ((e.target as Element).getAttribute('aria-hidden') !== 'true') {
                navigate(customerViewUrl);
            }
        },
        [navigate, customerViewUrl],
    );

    return (
        <>
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
                    <IconButton onClick={handleClickOptions} size="large">
                        <MoreIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseOptions}>
                        <MenuItem onClick={handleOption(RowOption.CreditCustomer)}>Credit Customer</MenuItem>
                    </Menu>
                </TableCell>
            </TableRow>
            <CustomerCreditDialog
                customerName={customerData.fullName}
                wallet={customerData.wallet}
                open={creditDialog}
                onClose={handleCreditDialogClose}
            />
        </>
    );
}
