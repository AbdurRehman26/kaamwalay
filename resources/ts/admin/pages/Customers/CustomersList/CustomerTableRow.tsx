import DoneIcon from '@mui/icons-material/Done';
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
import { MouseEvent, MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { UserEntity } from '@shared/entities/UserEntity';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { getSalesRep } from '@shared/redux/slices/adminSalesmenSlice';
import { CustomerCreditDialog } from '@admin/components/CustomerCreditDialog';
import { useAppDispatch } from '@admin/redux/hooks';

interface props {
    customer: CustomerEntity;
}

enum RowOption {
    CreditCustomer,
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

export function CustomerTableRow({ customer }: props) {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const [creditDialog, setCreditDialog] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [salesReps, setSalesRep] = useState([]);
    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);
    const handleCreditDialogClose = useCallback(() => setCreditDialog(false), []);

    const handleClickOptions = useCallback<MouseEventHandler>(
        (e) => {
            e.stopPropagation();
            setAnchorEl(e.target as Element);
        },
        [setAnchorEl],
    );

    useEffect(() => {
        (async () => {
            const data = await dispatch(getSalesRep());
            setSalesRep(data.payload.data);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                            {customer.phone}
                        </Typography>
                    </Grid>
                </TableCell>
                <TableCell variant={'body'}>{formatDate(customer.createdAt, 'MM/DD/YYYY')}</TableCell>
                <TableCell variant={'body'} align={'right'}>
                    {customer.submissions ?? 0}
                </TableCell>
                <TableCell variant={'body'} align={'right'}>
                    {customer.cardsCount}
                </TableCell>
                <TableCell variant={'body'} align={'right'}>
                    <Select autoWidth defaultValue={'Unassigned'}>
                        <MenuItem value="none">Select Owner</MenuItem>
                        {salesReps?.map((customer: UserEntity) => {
                            return (
                                <Grid
                                    sx={{ ':hover': { backgroundColor: '#20BFB814' } }}
                                    display={'flex'}
                                    p={1}
                                    alignItems={'center'}
                                >
                                    <Avatar src={customer?.profileImage ?? ''}>{customer?.getInitials?.()}</Avatar>
                                    <MenuItem
                                        key={customer?.id}
                                        value={customer?.fullName}
                                        sx={{ ':hover': { backgroundColor: 'transparent' } }}
                                    >
                                        {customer?.fullName}
                                    </MenuItem>
                                    <DoneIcon sx={{ marginLeft: 'auto' }} color={'primary'} />
                                </Grid>
                            );
                        })}
                    </Select>
                </TableCell>
                <TableCell variant={'body'} align={'right'}>
                    <Select autoWidth key={CustomerType[0].value} defaultValue={CustomerType[0].value}>
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
