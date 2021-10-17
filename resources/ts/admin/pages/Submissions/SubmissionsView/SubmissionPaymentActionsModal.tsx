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
import { useState } from 'react';
import NumberFormat from 'react-number-format';
import { addExtraChargeToOrder, refundOrderTransaction } from '@shared/redux/slices/adminOrdersSlice';
import { useAppDispatch } from '@admin/redux/hooks';

interface SubmissionPaymentActionsModalProps {
    openState: string | boolean;
    setShowPaymentActionsModal: any;
    orderId?: string | number;
}

interface NumberFormatCustomProps {
    inputRef: (instance: NumberFormat | null) => void;
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

function NumberFormatCustom(props: NumberFormatCustomProps) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            isNumericString
        />
    );
}

export default function SubmissionPaymentActionsModal({
    openState,
    setShowPaymentActionsModal,
    orderId,
}: SubmissionPaymentActionsModalProps) {
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const dispatch = useAppDispatch();
    const handleChangeAmount = (e: any) => {
        setAmount(e.target.value);
    };
    const handleChangeNotes = (e: any) => {
        setNotes(e.target.value);
    };
    const handleClose = () => {
        setNotes('');
        setAmount('');
        setShowPaymentActionsModal(false);
    };
    const handleSave = () => {
        if (openState === 'show-add-extra-charge') {
            dispatch(addExtraChargeToOrder({ amount, notes, orderId: orderId! }));
            handleClose();
        }

        if (openState === 'show-issue-refund') {
            dispatch(refundOrderTransaction({ amount, notes, orderId: orderId! }));
            handleClose();
        }
    };
    const getModalState = () => {
        if (openState === false) {
            return {
                showModal: false,
            };
        }
        if (openState === 'show-add-extra-charge') {
            return {
                showModal: true,
                modalTitle: 'Add Extra Charge',
                amountLabel: 'Charge Amount',
            };
        }
        if (openState === 'show-issue-refund') {
            return {
                showModal: true,
                modalTitle: 'Issue Refund',
                amountLabel: 'Refund Amount',
            };
        }
    };

    const isSaveDisabled = () => {
        return amount.length === 0 || notes.length === 0;
    };

    return (
        <div>
            <Dialog open={getModalState()?.showModal!} fullWidth maxWidth={'sm'} onClose={handleClose}>
                <DialogTitle>{getModalState()?.modalTitle!}</DialogTitle>
                <DialogContent>
                    <FormControl sx={{ marginTop: '12px' }} fullWidth>
                        <Typography sx={{ marginBottom: '8px' }} variant={'caption'}>
                            {getModalState()?.amountLabel!}
                        </Typography>
                        <TextField
                            value={amount}
                            onChange={handleChangeAmount}
                            size="small"
                            variant="outlined"
                            placeholder={'0.00'}
                            sx={{ fontWeight: 'bold' }}
                            InputProps={{
                                inputComponent: NumberFormatCustom as any,
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
                    <Button sx={{ color: '#000' }} onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        sx={{ paddingLeft: '24px', paddingRight: '24px' }}
                        color={'primary'}
                        variant={'contained'}
                        disabled={isSaveDisabled()}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
