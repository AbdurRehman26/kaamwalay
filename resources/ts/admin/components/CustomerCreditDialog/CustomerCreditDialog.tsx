import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { ChangeEvent, useCallback, useState } from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { UserEntity } from '@shared/entities/UserEntity';
import { WalletEntity } from '@shared/entities/WalletEntity';
import { CustomerCreditHistory } from './CustomerCreditHistory';
import { useRepository } from '@shared/hooks/useRepository';
import { WalletRepository } from '@shared/repositories/Admin/WalletRepository';
import { useAppDispatch } from '../../redux/hooks';
import { updateOrderWalletById } from '@shared/redux/slices/adminOrdersSlice';
import { useNotifications } from '@shared/hooks/useNotifications';

interface Props extends DialogProps {
    customer?: UserEntity | null;
    wallet?: WalletEntity | null;
}

const Root = styled(Dialog)(({ theme }) => ({
    '.MuiDialog-paper': {
        minWidth: 524,
    },
    '.MuiDialogContent-root': {
        padding: '28px 24px',
    },
    '.MuiDialogActions-root': {
        padding: '18px 24px',
        '.MuiButton-contained': {
            padding: '10px 18px',
            borderRadius: 2,
            marginLeft: theme.spacing(3),
        },
    },
    '.CustomerCreditDialog-history': {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        overflow: 'hidden',
    },
    '.CustomerCreditDialog-customerDescription': {
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.CustomerCreditDialog-customerTableHead': {
        backgroundColor: '#f9f9f9',
        position: 'sticky',
        top: 0,
        boxShadow: '0 1px 0 #eee',
        '.MuiTableCell-head': {
            paddingTop: 10,
            paddingBottom: 14,
            fontWeight: 500,
            fontSize: 10,
            lineHeight: '16px',
            letterSpacing: '0.75px',
            textTransform: 'uppercase',
            color: theme.palette.text.secondary,
        },
    },
    '.CustomerCreditDialog-customerTableBody': {
        '.MuiTableCell-root': {
            backgroundColor: '#fff',
        },
        '.MuiTableRow-root': {
            '&:last-child .MuiTableCell-body': {
                borderBottom: 'none',
            },
        },
    },
    '.CustomerCreditDialog-customerTableContainer': {
        maxHeight: 300,
        overflowY: 'auto',
    },
}));

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: CustomerCreditDialog
 * @date: 23.12.2021
 * @time: 18:31
 */
export function CustomerCreditDialog({ customer, wallet, onClose, ...rest }: Props) {
    const walletRepository = useRepository(WalletRepository);
    const dispatch = useAppDispatch();
    const notifications = useNotifications();
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState<string | number>(0);

    const handleAmount = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => setAmount(event.target.value ? Number(event.target.value) : ''),
        [],
    );

    const handleClose = useCallback(
        (event: {}) => {
            if (onClose) {
                onClose(event, 'escapeKeyDown');
            }
        },
        [onClose],
    );

    const handleApply = useCallback(async () => {
        if (amount && wallet?.id) {
            try {
                setLoading(true);
                await walletRepository.addCredit(wallet.id, amount);
                await dispatch(updateOrderWalletById(wallet.id));
            } catch (e: any) {
                notifications.exception(e);
                return;
            } finally {
                setLoading(false);
                setAmount(0);
            }
        }

        handleClose({});
    }, [amount, dispatch, handleClose, notifications, wallet?.id, walletRepository]);

    return (
        <Root onClose={handleClose} {...rest}>
            <Grid container alignItems={'center'} justifyContent={'space-between'} py={2} pl={3} pr={2}>
                <Grid item xs container alignItems={'center'} justifyContent={'flex-start'}>
                    <Typography variant={'h6'} fontWeight={500}>
                        Send Credit to Customer
                    </Typography>
                </Grid>

                <Grid item xs container alignItems={'center'} justifyContent={'flex-end'}>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <Divider />
            <DialogContent>
                <Grid container>
                    <Typography variant={'caption'} fontWeight={500}>
                        Credit Amount
                    </Typography>
                    <TextField
                        fullWidth
                        type={'number'}
                        variant={'outlined'}
                        value={amount}
                        onChange={handleAmount}
                        InputProps={{
                            inputProps: {
                                min: 0,
                                step: 0.01,
                            },
                            startAdornment: (
                                <InputAdornment position={'start'}>
                                    <Typography variant={'body2'} color={'textSecondary'}>
                                        $
                                    </Typography>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                <Stack mt={3.5} mb={2}>
                    <Typography variant={'subtitle1'} fontWeight={500}>
                        {customer?.getFullName()}
                    </Typography>
                    <Grid container alignItems={'center'}>
                        <Typography variant={'body2'} fontWeight={500} color={'textSecondary'}>
                            Wallet Balance:
                        </Typography>
                        <Typography variant={'body2'} ml={0.5}>
                            {formatCurrency(wallet?.balance ?? 0)}
                        </Typography>
                    </Grid>
                </Stack>

                <CustomerCreditHistory walletId={wallet?.id} />
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button onClick={handleClose} color={'inherit'}>
                    Cancel
                </Button>
                <LoadingButton loading={loading} variant={'contained'} onClick={handleApply}>
                    Apply Credit
                </LoadingButton>
            </DialogActions>
        </Root>
    );
}
