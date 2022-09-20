import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEditLabelDialog } from '@shared/redux/slices/adminOrderLabelsSlice';
import { RootState } from '../../redux/store';
import { LabelsContent } from './LabelsContent';

const LabelDialog = styled(Dialog)({
    '& .MuiPaper-root': {
        maxWidth: '675px',
    },
    '& .MuiDialogContent-root': {
        padding: '0px 0px',
    },
    '.CancelButton': {
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.35px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.ExportButton': {
        background: '#20BFB8',
        borderRadius: '4px',
        color: '#fff',
        padding: '10px 20px',
        '&:hover': {
            background: '#20BFB8',
        },
    },
});

export function EditLabelDialog() {
    const dispatch = useDispatch();
    const labelDialog = useSelector((state: RootState) => state.adminOrderLabels.openLabelDialog.labelDialog);
    const orderLabels = useSelector((state: RootState) => state.adminOrderLabels.orderLabels.labels);
    const cardLabels = useSelector((state: RootState) => state.adminOrderLabels.cardsLabel.labels);

    const handleModal = useCallback(() => {
        dispatch(setEditLabelDialog(false));
    }, [dispatch]);

    return (
        <LabelDialog onClose={handleModal} open={labelDialog} fullWidth>
            <DialogTitle>
                Edit Label Text
                <IconButton
                    onClick={handleModal}
                    aria-label="close"
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            {orderLabels.length !== 0 ? (
                orderLabels.map((orderLabel) => (
                    <DialogContent dividers>
                        <LabelsContent labels={orderLabel} />
                    </DialogContent>
                ))
            ) : (
                <DialogContent dividers>
                    <LabelsContent labels={cardLabels} />
                </DialogContent>
            )}
            <DialogActions>
                <Button className={'CancelButton'} onClick={handleModal}>
                    Cancel
                </Button>
                <Button className={'ExportButton'} type={'submit'}>
                    Export
                </Button>
            </DialogActions>
        </LabelDialog>
    );
}
