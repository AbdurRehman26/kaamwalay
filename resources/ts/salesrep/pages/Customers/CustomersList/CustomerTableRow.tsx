import MoreIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { CustomerCreditDialog } from '@salesrep/components/CustomerCreditDialog';
import { useAppDispatch } from '@salesrep/redux/hooks';
import React, { MouseEvent, MouseEventHandler, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { setCustomer } from '@shared/redux/slices/editCustomerSlice';

interface props {
    customer: CustomerEntity;
    onEditCustomer?: any;
}

enum RowOption {
    CreditCustomer,
    EditCustomerDetails,
}

const CustomerType = [
    { label: 'Retail', value: 0 },
    { label: 'Wholesale', value: 1 },
];

const styles = {
    TableRow: {
        '&:hover': {
            cursor: 'pointer',
            background: '#F9F9F9',
        },
    },
};

export function CustomerTableRow({ customer, onEditCustomer }: props) {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const [creditDialog, setCreditDialog] = useState(false);
    const navigate = useNavigate();
    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);
    const handleCreditDialogClose = useCallback(() => setCreditDialog(false), []);
    const dispatch = useAppDispatch();

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
                case RowOption.EditCustomerDetails:
                    dispatch(setCustomer(customer));
                    onEditCustomer();
                    break;
            }
        },
        [customer, dispatch, handleCloseOptions, onEditCustomer],
    );

    const handleRowClick = useCallback<MouseEventHandler>(
        (e) => {
            if ((e.target as Element).getAttribute('aria-hidden') !== 'true') {
                navigate(`/customers/${customer.id}/view`);
            }
        },
        [navigate, customer.id],
    );

    return (
        <>
            <TableRow key={customer.id} onClick={handleRowClick} sx={styles.TableRow}>
                <TableCell variant={'body'}>
                    <Grid container>
                        <Avatar src={customer.profileImage ?? ''}>{customer.getInitials()}</Avatar>
                        <Grid item xs container direction={'column'} pl={2}>
                            <Typography variant={'body2'}>{customer.fullName}</Typography>
                            <Typography variant={'caption'} color={'textSecondary'}>
                                {customer.customerNumber}
                            </Typography>
                        </Grid>
                    </Grid>
                </TableCell>
                <TableCell variant={'body'}>
                    <Grid item xs container direction={'column'}>
                        <Typography variant={'body2'}>{customer.email}</Typography>
                        <Typography variant={'caption'} color={'textSecondary'}>
                            {customer.phone ?? '-'}
                        </Typography>
                    </Grid>
                </TableCell>
                <TableCell variant={'body'}>{formatDate(customer.createdAt, 'MM/DD/YYYY')}</TableCell>
                <TableCell variant={'body'} align={'center'}>
                    {customer.submissions ?? 0}
                </TableCell>
                <TableCell variant={'body'} align={'center'}>
                    {customer.cardsCount}
                </TableCell>
                <TableCell variant={'body'} align={'right'}>
                    <Select
                        sx={{ height: '40px !important' }}
                        autoWidth
                        key={CustomerType[0].value}
                        defaultValue={CustomerType[0].value}
                        onChange={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        {CustomerType.map((item: any) => (
                            <MenuItem key={item.value} value={item.value}>
                                {item?.label}
                            </MenuItem>
                        ))}
                    </Select>
                </TableCell>
                <TableCell variant={'body'} align={'right'}>
                    {formatCurrency(customer.wallet?.balance ?? 0)}
                </TableCell>
                <TableCell variant={'body'} align={'right'}>
                    <IconButton onClick={handleClickOptions} size="large">
                        <MoreIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseOptions}>
                        <MenuItem onClick={handleOption(RowOption.CreditCustomer)}>Credit Customer</MenuItem>
                        <MenuItem onClick={handleOption(RowOption.EditCustomerDetails)}>Edit Customer Details</MenuItem>
                    </Menu>
                </TableCell>
            </TableRow>
            <CustomerCreditDialog
                customer={customer}
                wallet={customer.wallet}
                open={creditDialog}
                onClose={handleCreditDialogClose}
            />
        </>
    );
}
