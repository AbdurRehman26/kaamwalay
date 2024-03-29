import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ImageUploader from '@shared/components/ImageUploader';
import { AddCommissionPaymentDto } from '@shared/dto/AddCommissionPaymentDto';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRepository } from '@shared/hooks/useRepository';
import { nameInitials } from '@shared/lib/strings/initials';
import { storeSalesRepCommissionPayment } from '@shared/redux/slices/adminSalesRepCommissionPayments';
import { FilesRepository } from '@shared/repositories/FilesRepository';
import { useAppDispatch, useAppSelector } from '@admin/redux/hooks';

interface SalesRepAddDialogProps extends Omit<DialogProps, 'onSubmit'> {
    onSubmit?(): Promise<void> | void;
    fromSubmission?: boolean;
}

const RootDialogContainer = styled(Dialog)(({ theme }) => ({
    '.MuiDialog-paper': {
        minWidth: 720,
    },
    '.MuiDialogContent-root': {
        padding: '0px 24px 20px 24px !important',
    },
    '.MuiDialogActions-root': {
        padding: '18px 24px',
        '.MuiButton-contained': {
            padding: '10px 18px',
            borderRadius: 2,
            marginLeft: theme.spacing(3),
        },
    },
}));

const useStyles = makeStyles(
    () => {
        return {
            textField: {
                height: 36,
                radius: 4,
            },
            label: {
                fontFamily: 'Roboto',
                fontWeight: 500,
                fontSize: 13,
                lineHeight: '16px',
                marginBottom: 8,
                marginTop: 4,
            },
        };
    },
    { name: '' },
);

const SalesRepDetailsContainer = styled(Grid)({
    '.ImageDiv': {
        marginTop: 8,
        maxWidth: '48px !important',
    },
    '.Avatar': {
        background: '#B5CBED',
        width: '48px',
        height: '48px',
        fontWeight: 500,
        fontSize: '25px',
        lineHeight: '30px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.CustomerName': {
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '24px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.CustomerHeading': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: 'rgba(0, 0, 0, 0.54)',
        padding: '2px 0px',
    },
    '.Customer': {
        paddingTop: '10px',
    },
    '.CustomerValue': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: 'rgba(0, 0, 0, 0.87)',
        paddingLeft: '5px',
    },
});

export function AddCommissionPaymentDialog({ onClose, fromSubmission, onSubmit, ...rest }: SalesRepAddDialogProps) {
    const { id } = useParams<'id'>();
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const notifications = useNotifications();
    const [loading, setLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [notes, setNotes] = useState('');
    const [amount, setAmount] = useState<number>(0);
    const filesRepository = useRepository(FilesRepository);
    const salesrep = useAppSelector((state) => state.adminSalesRep.salesRep);
    const handleClose = useCallback(
        (event: {}) => {
            if (onClose) {
                onClose(event, 'escapeKeyDown');
            }
        },
        [onClose],
    );

    const handleAddCommissionPayment = async () => {
        let uploadedFile = '';
        if (uploadedImage) {
            uploadedFile = await filesRepository.uploadFile(uploadedImage);
        }
        const commissionInput: AddCommissionPaymentDto = {
            notes,
            amount,
            fileUrl: uploadedFile,
            salesmanId: Number(id),
        };
        try {
            setLoading(true);
            const data = await dispatch(storeSalesRepCommissionPayment(commissionInput));
            if (!data?.error) onSubmit?.();
        } catch (e: any) {
            notifications.exception(e);
            return;
        } finally {
            setLoading(false);
        }
    };

    const isValid = useMemo(() => {
        return !!amount;
    }, [amount]);

    return (
        <RootDialogContainer onClose={handleClose} {...rest}>
            <Grid container alignItems={'center'} justifyContent={'space-between'} py={2} pl={3} pr={2}>
                <Grid item xs container alignItems={'center'} justifyContent={'flex-start'}>
                    <Typography variant={'h6'} fontWeight={500}>
                        Add Commission Payment{' '}
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
                <SalesRepDetailsContainer container marginTop={3} marginBottom={3} paddingLeft={0.5}>
                    <Grid item xs className={'ImageDiv'} alignItems={'center'}>
                        <Avatar src={salesrep.profileImage ?? ''} variant="circular" className={'Avatar'}>
                            {nameInitials(salesrep.fullName)}
                        </Avatar>
                    </Grid>
                    <Grid container item xs alignItems={'center'} pl={1.5}>
                        <Grid className={'Customer'}>
                            <Grid container item xs direction="row">
                                <Typography className={'CustomerName'}>{salesrep.fullName}</Typography>
                            </Grid>
                            <Typography className={'CustomerHeading'}>
                                Unpaid Commission: <span className={'CustomerValue'}>${salesrep.unpaidCommission}</span>
                            </Typography>
                        </Grid>
                    </Grid>
                </SalesRepDetailsContainer>
                <Grid container item display={'flex'} justifyContent={'space-between'} flexWrap={'nowrap'} my={2}>
                    <Grid md={4} m={1}>
                        <Typography variant={'subtitle1'} className={classes.label}>
                            Upload
                        </Typography>
                        <ImageUploader maxHeight="230px" maxWidth="213px" onChange={(img) => setUploadedImage(img)} />
                    </Grid>
                    <Grid md={12} m={1}>
                        <Grid md={12} mr={0.5}>
                            <Typography variant={'subtitle1'} className={classes.label}>
                                Payment Amount*
                            </Typography>
                            <TextField
                                onChange={(e) => setAmount(Number(e.target.value))}
                                type={'number'}
                                name={'amount'}
                                className={classes.textField}
                                placeholder={'Enter First Name'}
                                variant="outlined"
                                value={amount}
                                fullWidth
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
                        <Grid md={12} ml={0.5} mt={6}>
                            <Typography variant={'subtitle1'} className={classes.label}>
                                Notes
                            </Typography>
                            <TextField
                                onChange={(e) => setNotes(e.target.value)}
                                name={'notes'}
                                className={classes.textField}
                                placeholder={'Enter notes...'}
                                variant="outlined"
                                value={notes}
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <Divider></Divider>
            <DialogActions>
                <Button onClick={handleClose} color={'inherit'}>
                    Cancel
                </Button>
                <LoadingButton
                    type={'submit'}
                    onClick={handleAddCommissionPayment}
                    loading={loading}
                    disabled={!isValid || loading}
                    variant={'contained'}
                >
                    {'Add Payment'}
                </LoadingButton>
            </DialogActions>
        </RootDialogContainer>
    );
}
