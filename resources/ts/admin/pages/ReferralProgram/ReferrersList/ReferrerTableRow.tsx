import MoreIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React, { MouseEvent, MouseEventHandler, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReferrerStatusChip } from '@shared/components/ReferrerStatusChip';
import { ReferrerStatusEnum } from '@shared/constants/ReferrerStatusEnum';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { SalesRepEntity } from '@shared/entities/SalesRepEntity';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { changeReferralStatus } from '@shared/redux/slices/adminCustomerReferralCommissionSlice';
import { CustomerCreditDialog } from '@admin/components/CustomerCreditDialog';
import CustomerReferralActivationDialog from '@admin/pages/Customers/CustomersList/CustomerReferralActivationDialog';
import { useAppDispatch } from '@admin/redux/hooks';

interface props {
    customer: CustomerEntity;
    salesReps: SalesRepEntity[];
}

enum RowOption {
    CreditCustomer,
    Deactivate,
    Reactivate,
}

const styles = {
    TableRow: {
        '&:hover': {
            cursor: 'pointer',
            background: '#F9F9F9',
        },
    },
};

export function ReferrerTableRow({ customer, salesReps }: props) {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const [creditDialog, setCreditDialog] = useState(false);
    const navigate = useNavigate();
    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);
    const handleCreditDialogClose = useCallback(() => setCreditDialog(false), []);
    const [referralDialog, setReferralDialog] = useState(false);
    const handleReferralDialogClose = useCallback(() => setReferralDialog(false), []);
    const dispatch = useAppDispatch();

    const handleClickOptions = useCallback<MouseEventHandler>(
        (e) => {
            e.stopPropagation();
            setAnchorEl(e.target as Element);
        },
        [setAnchorEl],
    );

    const handleOption = useCallback(
        (option: RowOption, customerId?: number, status?: boolean) => async (e: MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            handleCloseOptions();
            switch (option) {
                case RowOption.CreditCustomer:
                    setCreditDialog(true);
                    break;
                case RowOption.Reactivate:
                case RowOption.Deactivate:
                    setReferralDialog(true);
                    break;
            }
        },
        [handleCloseOptions],
    );

    const handleRowClick = useCallback<MouseEventHandler>(
        (e) => {
            if ((e.target as Element).getAttribute('aria-hidden') !== 'true') {
                navigate(`/customers/${customer.id}/view/overview`);
            }
        },
        [navigate, customer.id],
    );

    const handleChangeReferralProgram = useCallback(
        async (customerId: number, referralStatus: boolean) => {
            const DTO = { customerId, referralStatus };
            await dispatch(changeReferralStatus(DTO));
            window.location.reload();
        },
        [dispatch],
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
                <TableCell variant={'body'} align={'right'}>
                    {customer.submissions ?? 0}
                </TableCell>
                <TableCell variant={'body'} align={'right'}>
                    {customer.cardsCount}
                </TableCell>
                <TableCell variant={'body'} align={'right'}>
                    {customer.signUps}
                </TableCell>
                <TableCell variant={'body'} align={'left'}>
                    <ReferrerStatusChip
                        color={customer.isReferralActive}
                        label={ReferrerStatusEnum[customer.isReferralActive]}
                    />
                </TableCell>
                <TableCell variant={'body'} align={'right'}>
                    {formatCurrency(customer.sales ?? 0)}
                </TableCell>
                <TableCell variant={'body'} align={'right'}>
                    {formatCurrency(customer.commission ?? 0)}
                </TableCell>
                <TableCell variant={'body'} align={'right'}>
                    <IconButton onClick={handleClickOptions} size="large">
                        <MoreIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseOptions}>
                        <MenuItem onClick={handleOption(RowOption.CreditCustomer)}>Credit Customer</MenuItem>
                        {customer?.isReferralActive ? (
                            <MenuItem onClick={handleOption(RowOption.Deactivate, customer.id, false)}>
                                Deactivate Referral Program
                            </MenuItem>
                        ) : (
                            <MenuItem onClick={handleOption(RowOption.Reactivate, customer.id, true)}>
                                Reactivate Referral Program
                            </MenuItem>
                        )}
                    </Menu>
                </TableCell>
            </TableRow>
            <CustomerCreditDialog
                customer={customer}
                wallet={customer.wallet}
                open={creditDialog}
                onClose={handleCreditDialogClose}
            />
            <CustomerReferralActivationDialog
                open={referralDialog}
                onSubmit={() => handleChangeReferralProgram(customer.id, !customer?.isReferralActive)}
                status={!!customer?.isReferralActive}
                onClose={handleReferralDialogClose}
            />
        </>
    );
}
