import { FormControl } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { editTransactionNotes } from '@shared/redux/slices/adminOrdersSlice';

interface PaymentEditNotesModalProps {
    showEditNotes: boolean;
    setShowEditNotes: any;
    existingNotes: string;
    transactionId: string | number;
    orderId: string | number;
    transactionType: 'refund' | 'extra_charge';
}

export default function PaymentEditNotesModal({
    showEditNotes,
    setShowEditNotes,
    existingNotes,
    transactionId,
    orderId,
    transactionType,
}: PaymentEditNotesModalProps) {
    const [notes, setNotes] = useState(existingNotes);
    const dispatch = useDispatch();
    const handleChangeNotes = (e: any) => {
        setNotes(e.target.value);
    };
    const handleClose = () => {
        setShowEditNotes(false);
    };
    const handleSave = () => {
        dispatch(editTransactionNotes({ orderId, transactionId, transactionType, notes }));
        handleClose();
    };

    const isSaveDisabled = () => {
        return notes.length === 0;
    };

    useEffect(() => {
        setNotes(existingNotes);
    }, [existingNotes, showEditNotes]);

    return (
        <div>
            <Dialog open={showEditNotes} fullWidth maxWidth={'sm'} onClose={handleClose}>
                <DialogTitle>Edit Notes</DialogTitle>
                <DialogContent>
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
