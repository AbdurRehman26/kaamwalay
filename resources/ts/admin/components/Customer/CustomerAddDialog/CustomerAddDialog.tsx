import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Form, Formik } from 'formik';
import React, { useCallback, useMemo, useState } from 'react';
import { FormInput } from '@shared/components/AuthDialog/FormInput';
import { useStyles } from '@shared/components/AuthDialog/styles';
import { SignUpValidationRules } from '@shared/components/AuthDialog/validation';
import { SignUpRequestDto } from '@shared/dto/SignUpRequestDto';
import { UserEntity } from '@shared/entities/UserEntity';
import { WalletEntity } from '@shared/entities/WalletEntity';
import { useAuth } from '@shared/hooks/useAuth';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRepository } from '@shared/hooks/useRepository';
import { updateOrderWalletById } from '@shared/redux/slices/adminOrdersSlice';
import { WalletRepository } from '@shared/repositories/Admin/WalletRepository';
import { useAppDispatch } from '../../../redux/hooks';

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
export function CustomerAddDialog({ customer, wallet, onClose, ...rest }: Props) {
    const classes = useStyles();
    const walletRepository = useRepository(WalletRepository);
    const dispatch = useAppDispatch();
    const notifications = useNotifications();
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState<string | number>(0);
    const { register } = useAuth();

    const initialState = useMemo<SignUpRequestDto>(
        () => ({
            fullName: '',
            email: '',
            phone: '',
            password: '',
            passwordConfirmation: '',
        }),
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

    const handleSubmit = useCallback(
        async (values: SignUpRequestDto) => {
            values = { ...values, passwordConfirmation: values.password };
            await register(values);
        },
        [register],
    );

    return (
        <Root onClose={handleClose} {...rest}>
            <Grid container alignItems={'center'} justifyContent={'space-between'} py={2} pl={3} pr={2}>
                <Grid item xs container alignItems={'center'} justifyContent={'flex-start'}>
                    <Typography variant={'h6'} fontWeight={500}>
                        Add Customer
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
                    <Formik
                        initialValues={initialState}
                        onSubmit={handleSubmit}
                        validationSchema={SignUpValidationRules}
                        validateOnChange
                    >
                        <Form className={classes.root}>
                            <FormInput type={'text'} label={'Full name'} name={'fullName'} />
                            <FormInput type={'text'} label={'Email'} name={'email'} />
                            <FormInput type={'phone'} label={'Phone Number'} name={'phone'} />
                        </Form>
                    </Formik>
                </Grid>
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button onClick={handleClose} color={'inherit'}>
                    Cancel
                </Button>
                <LoadingButton loading={loading} variant={'contained'} onClick={handleApply}>
                    Add Customer
                </LoadingButton>
            </DialogActions>
        </Root>
    );
}
