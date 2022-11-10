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
import { MouseEvent, MouseEventHandler, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { SalesRepEntity } from '@shared/entities/SalesRepEntity';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { nameInitials } from '@shared/lib/strings/initials';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { assignSalesRep, unAssignSalesRep } from '@shared/redux/slices/adminCustomersSlice';
import { CustomerCreditDialog } from '@admin/components/CustomerCreditDialog';
import { useAppDispatch } from '@admin/redux/hooks';

interface props {
    customer: CustomerEntity;
    salesReps: SalesRepEntity[];
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

export function CustomerTableRow({ customer, salesReps }: props) {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const [creditDialog, setCreditDialog] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [defaultValue, setDefaultValue] = useState('Unassigned');
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

    async function assignSalesRef(event: any) {
        if (event.target.value === 'none') {
            await dispatch(unAssignSalesRep({ userId: customer.id }));
        } else {
            await dispatch(assignSalesRep({ userId: customer.id, salesmanId: event.target.value }));
        }
        window.location.reload();
    }

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
                <TableCell variant={'body'} align={'left'}>
                    <Select
                        sx={{ height: '40px !important', width: '170px !important' }}
                        aria-hidden={'false'}
                        onClick={(e: any) => e.stopPropagation()}
                        onChange={(e: any) => {
                            assignSalesRef(e);
                        }}
                        fullWidth
                        displayEmpty
                        onOpen={() => {
                            setDefaultValue('No Owner');
                            setIsOpen(true);
                        }}
                        onClose={() => {
                            setDefaultValue('Unassigned');
                            setIsOpen(false);
                        }}
                        value={customer?.salesman?.id || 'none'}
                    >
                        <MenuItem value="none">{defaultValue}</MenuItem>
                        {salesReps
                            .filter((saleRep) => {
                                return saleRep.id !== customer.id;
                            })
                            .map((saleRep) => {
                                return (
                                    <MenuItem
                                        key={saleRep?.id}
                                        value={saleRep?.id}
                                        sx={{ ':hover': { backgroundColor: 'transparent' } }}
                                    >
                                        <Grid
                                            width={'100%'}
                                            sx={{ ':hover': { backgroundColor: '#20BFB814' }, paddingLeft: '0px' }}
                                            display={'flex'}
                                            justifyContent={'flex-start'}
                                            p={1}
                                            alignItems={'left'}
                                        >
                                            <Avatar
                                                sx={{
                                                    marginRight: '5px',
                                                    padding: '2px',
                                                    height: '25px',
                                                    width: '25px',
                                                    fontSize: '12px',
                                                }}
                                                src={saleRep?.profileImage}
                                            >
                                                {nameInitials(
                                                    `${saleRep.firstName ?? ''} ${saleRep.lastName ?? ''}`.trim(),
                                                )}
                                            </Avatar>
                                            <Typography>
                                                {!isOpen
                                                    ? saleRep?.fullName.substring(0, 10) + '...'
                                                    : saleRep.fullName}
                                            </Typography>
                                            {customer?.salesman?.id === saleRep.id &&
                                            saleRep?.fullName.length > 10 &&
                                            isOpen ? (
                                                <DoneIcon sx={{ marginLeft: 'auto' }} color={'primary'} />
                                            ) : null}
                                        </Grid>
                                    </MenuItem>
                                );
                            })}
                    </Select>
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
