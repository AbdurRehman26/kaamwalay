import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useCallback, useMemo } from 'react';
import { ShippingMethodType } from '@shared/constants/ShippingMethodType';
import { ShippingMethodEntity } from '@shared/entities/ShippingMethodEntity';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { setDialog } from '@dashboard/redux/slices/newSubmissionSlice';

interface SubmissionShippingDetailDialogProps {
    shippingMethod?: ShippingMethodEntity;
    paid?: boolean;
}

const LabelDialog = styled(Dialog)({
    '& .MuiPaper-root': {
        maxWidth: '491px',
    },
    '.Content': {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '24px',
        letterSpacing: '0.1px',
        color: '#000000',
    },
    '.Title': {
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '30px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.CloseButton': {
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.35px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
});

export default function SubmissionShippingDetailDialog({ shippingMethod, paid }: SubmissionShippingDetailDialogProps) {
    const dispatch = useAppDispatch();
    const dialog = useAppSelector((state) => state.newSubmission.dialog);

    const handleDialog = useCallback(() => {
        dispatch(setDialog(false));
    }, [dispatch]);

    const title = useMemo(() => {
        if (shippingMethod?.code === ShippingMethodType.VaultStorage) {
            return <Typography className={'Title'}>What is vault storage?</Typography>;
        } else {
            return <Typography className={'Title'}>What is insured shipping?</Typography>;
        }
    }, [shippingMethod]);

    const content = useMemo(() => {
        if (paid && shippingMethod?.code === ShippingMethodType.VaultStorage) {
            return (
                <Stack>
                    <Typography mb={2.5} className={'Content'}>
                        Since you have already paid, you cannot switch from Vault Storage to Insured Shipping from the
                        submission page.
                    </Typography>
                    <Typography className={'Content'}>
                        If you want your cards shipped back to you, you will have to wait till this submission is{' '}
                        <b>Stored in Vault</b>, then go to Your Cards to create a shipment.
                    </Typography>
                </Stack>
            );
        } else if (shippingMethod?.code === ShippingMethodType.VaultStorage) {
            return (
                <Typography className={'Content'}>
                    Vault storage allows you to safely store your cards in our AGS Vault. Rather than shipping it back
                    after grading, we will store your slabbed cards in a level-8 secrity safe. Vault storage is
                    completely free and you can opt to have your cards shipped back to you at any point.
                </Typography>
            );
        } else {
            return (
                <Typography className={'Content'}>
                    AGS insurance begins to apply to your cards once we receive them up to the point that they are
                    marked delivered back to you by our carrier. It covers any loss or damage that might occur to your
                    cards (up to their full value) while they are in our possession or in transit back to you. AGS
                    insurance does not apply to stolen packages (after delivery) or to any shipments you make to AGS. If
                    you want to insure your shipments to AGS, you have to do that independently with your carrier.
                </Typography>
            );
        }
    }, [shippingMethod, paid]);

    return (
        <LabelDialog open={dialog} fullWidth>
            <DialogTitle>
                {title}
                <IconButton
                    onClick={handleDialog}
                    aria-label="close"
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: '#000000',
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>{content}</DialogContent>
            <DialogActions sx={{ padding: '20px' }}>
                <Button className={'CloseButton'} onClick={handleDialog}>
                    Close
                </Button>
            </DialogActions>
        </LabelDialog>
    );
}
