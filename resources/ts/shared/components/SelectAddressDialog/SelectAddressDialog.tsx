import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import { useCallback } from 'react';
import { AddressEntity } from '../../entities/AddressEntity';
import { FormikButton } from '../fields/FormikButton';
import { SelectAddressDialogContent } from './SelectAddressDialogContent';

const initialValues = {
    address: new AddressEntity(),
    newAddress: false,
};

export interface SelectAddressFormValues {
    address: AddressEntity;
    newAddress: boolean;
}

interface SelectAddressDialogProps extends Omit<DialogProps, 'onSubmit'> {
    onSubmit: (values: SelectAddressFormValues) => void | Promise<void>;
}

export function SelectAddressDialog({ onSubmit, ...rest }: SelectAddressDialogProps) {
    const handleSubmit = useCallback(
        async (values) => {
            await onSubmit(values);

            if (rest.onClose) {
                rest.onClose({}, 'escapeKeyDown');
            }
        },
        [onSubmit, rest],
    );

    return (
        <Dialog fullWidth maxWidth={'sm'} {...rest}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                <Form>
                    <Grid container alignItems={'center'} py={2} pl={3} pr={2}>
                        <Typography variant={'h6'} fontWeight={500} flexGrow={1}>
                            Confirm Your Shipping Address
                        </Typography>
                        <IconButton onClick={rest.onClose as any}>
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                    <Divider />
                    <SelectAddressDialogContent />
                    <DialogActions sx={{ px: 3, py: 2.5 }}>
                        <Button onClick={() => rest.onClose && rest.onClose({}, 'escapeKeyDown')}>Cancel</Button>
                        <FormikButton variant={'contained'} color={'primary'}>
                            Confirm
                        </FormikButton>
                    </DialogActions>
                </Form>
            </Formik>
        </Dialog>
    );
}
