import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { NumberFormatTextField } from '@shared/components/NumberFormatTextField';
import { addExtraChargeToOrder, refundOrderTransaction } from '@shared/redux/slices/adminOrdersSlice';
import { useAppDispatch } from '@admin/redux/hooks';
import { DialogStateEnum, DialogStateMap } from './SubmissionTransactionDialogEnum';

interface SubmissionPaymentActionsModalProps {
    openState: DialogStateEnum | null;
    setShowPaymentActionsModal: any;
    orderId?: number;
}

export default function SubmissionPaymentActionsModal({
    openState,
    setShowPaymentActionsModal,
    orderId,
}: SubmissionPaymentActionsModalProps) {
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [addToWallet, setAddToWallet] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();

    const handleChangeAmount = useCallback((e: any) => {
        setAmount(e.target.value);
    }, []);

    const handleChangeNotes = useCallback((e: any) => {
        setNotes(e.target.value);
    }, []);

    const handleClose = useCallback(() => {
        setNotes('');
        setAmount('');
        setShowPaymentActionsModal(false);
    }, [setShowPaymentActionsModal]);

    const handleSave = useCallback(() => {
        setIsLoading(true);
        if (openState === 'show-add-extra-charge') {
            dispatch(addExtraChargeToOrder({ amount, notes, orderId: orderId! }))
                .unwrap()
                .then(() => {
                    setIsLoading(false);
                    handleClose();
                })
                .catch(() => {
                    setIsLoading(false);
                });
        }

        if (openState === 'show-issue-refund') {
            dispatch(refundOrderTransaction({ amount, notes, orderId: orderId!, addToWallet }))
                .unwrap()
                .then(() => {
                    setIsLoading(false);
                    handleClose();
                })
                .catch(() => {
                    setIsLoading(false);
                    handleClose();
                });
        }
    }, [addToWallet, dispatch, amount, notes, orderId, openState, handleClose]);

    const handleRefundCredit = useCallback(() => setAddToWallet((prev) => !prev), []);
    const dialogState = useMemo(() => (openState ? DialogStateMap[openState] : null), [openState]);
    const isSaveDisabled = useMemo(() => amount.length === 0 || notes.length === 0, [amount, notes]);

    return (
        <Dialog open={!!dialogState} fullWidth maxWidth={'sm'} onClose={handleClose}>
            <DialogTitle>{dialogState?.title}</DialogTitle>
            <DialogContent>
                <FormControl sx={{ marginTop: '12px' }} fullWidth>
                    <Typography sx={{ marginBottom: '8px' }} variant={'caption'}>
                        {dialogState?.amountLabel!}
                    </Typography>
                    <NumberFormatTextField
                        value={amount}
                        onChange={handleChangeAmount}
                        size="small"
                        variant="outlined"
                        placeholder={'0.00'}
                        sx={{ fontWeight: 'bold' }}
                        InputProps={{
                            inputProps: { min: 1, max: 1000000 },
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                    />
                </FormControl>
                <FormControl sx={{ marginTop: '12px' }} fullWidth>
                    <Typography sx={{ marginBottom: '8px' }} variant={'caption'}>
                        Notes to Customer
                    </Typography>
                    <TextField
                        value={notes}
                        multiline
                        rows={4}
                        onChange={handleChangeNotes}
                        variant="outlined"
                        placeholder={'Enter notes'}
                    />
                </FormControl>

                {openState === 'show-issue-refund' ? (
                    <FormControl fullWidth>
                        <FormControlLabel
                            control={<Checkbox checked={addToWallet} onChange={handleRefundCredit} color="primary" />}
                            label={
                                <Box display={'flex'} alignItems={'center'}>
                                    <Typography mr={1}>Credit to Customer Wallet</Typography>
                                    <Tooltip title="Selecting this will send credit to a customers Robograding Account. It will not refund the amount to the original form of payment.">
                                        <IconButton aria-label="info">
                                            <InfoOutlinedIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            }
                        />
                    </FormControl>
                ) : null}
            </DialogContent>
            <DialogActions sx={{ padding: '24px' }}>
                <Button color={'inherit'} onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    sx={{ paddingLeft: '24px', paddingRight: '24px' }}
                    color={'primary'}
                    variant={'contained'}
                    disabled={isSaveDisabled || isLoading}
                    onClick={handleSave}
                >
                    {isLoading ? <CircularProgress color={'primary'} /> : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
