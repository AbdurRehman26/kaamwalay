import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useFormikContext } from 'formik';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { AddressEntity } from '../../entities/AddressEntity';
import { useRepository } from '../../hooks/useRepository';
import { UserRepository } from '../../repositories/UserRepository';
import { Addresses } from './Addresses';
import { NewAddressForm } from './NewAddressForm';

export function SelectAddressDialogContent() {
    const userRepository = useRepository(UserRepository);

    const formik = useFormikContext<Record<string, any>>();
    const newAddress = formik.values.newAddress;

    const addresses = useQuery('customer/addresses', () => userRepository.getAddresses(), {
        onSuccess(data) {
            if (data.length === 0) {
                formik.setFieldValue('newAddress', true);
            } else {
                formik.setFieldValue('address', data[0]);
            }
        },
    });

    const handleNewAddress = useCallback(() => {
        formik.setFieldValue('newAddress', true);
        formik.setFieldValue('backup', formik.values.address);
        formik.setFieldValue('address', new AddressEntity());
    }, [formik]);

    const hasAddresses = !!addresses.data && addresses.data.length > 0;

    if (addresses.isLoading) {
        return (
            <DialogContent>
                <Grid container justifyContent={'center'} p={4}>
                    <CircularProgress />
                </Grid>
            </DialogContent>
        );
    }

    return (
        <DialogContent>
            <Slide in={!newAddress} direction={'right'} unmountOnExit exit={false}>
                <Stack>
                    <Typography variant={'subtitle1'} fontWeight={500} mb={2}>
                        Existing Addresses
                    </Typography>

                    <Addresses addresses={addresses.data || []} />

                    {hasAddresses && (
                        <Button onClick={handleNewAddress} variant={'outlined'} color={'primary'}>
                            Create a new Address
                        </Button>
                    )}
                </Stack>
            </Slide>

            <Slide in={newAddress} direction={'left'} unmountOnExit exit={false}>
                <NewAddressForm canGoBack={hasAddresses} />
            </Slide>
        </DialogContent>
    );
}
