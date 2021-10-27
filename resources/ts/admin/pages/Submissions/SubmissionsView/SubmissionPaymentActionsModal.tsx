import { FormControl } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { NumberFormatInput } from '@shared/components/NumberFormat';
import { addExtraChargeToOrder, refundOrderTransaction } from '@shared/redux/slices/adminOrdersSlice';
import { useAppDispatch } from '@admin/redux/hooks';
import { DialogStateMap, DialogStateEnum } from './SubmissionTransactionDialogEnum';

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
    const dispatch = useAppDispatch();

    const handleChangeAmount = useCallback(
        (e: any) => {
            setAmount(e.target.value);
        },
        [amount],
    );

    const handleChangeNotes = useCallback(
        (e: any) => {
            setNotes(e.target.value);
        },
        [notes],
    );

    const handleClose = useCallback(() => {
        setNotes('');
        setAmount('');
        setShowPaymentActionsModal(false);
    }, [notes, amount, setShowPaymentActionsModal]);

    const handleSave = useCallback(() => {
        if (openState === 'show-add-extra-charge') {
            dispatch(addExtraChargeToOrder({ amount, notes, orderId: orderId! }));
            handleClose();
        }

        if (openState === 'show-issue-refund') {
            dispatch(refundOrderTransaction({ amount, notes, orderId: orderId! }));
            handleClose();
        }
    }, [dispatch, addExtraChargeToOrder, amount, notes, orderId, openState, handleClose]);

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
                    <TextField
                        value={amount}
                        onChange={handleChangeAmount}
                        size="small"
                        variant="outlined"
                        placeholder={'0.00'}
                        sx={{ fontWeight: 'bold' }}
                        InputProps={{
                            inputComponent: NumberFormatInput as any,
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
            </DialogContent>
            <DialogActions sx={{ padding: '24px' }}>
                <Button color={'inherit'} onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    sx={{ paddingLeft: '24px', paddingRight: '24px' }}
                    color={'primary'}
                    variant={'contained'}
                    disabled={isSaveDisabled}
                    onClick={handleSave}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
