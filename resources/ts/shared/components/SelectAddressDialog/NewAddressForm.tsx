import ArrowBack from '@mui/icons-material/ArrowBack';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormikContext } from 'formik';
import React, { forwardRef, useCallback } from 'react';
import NumberFormat from 'react-number-format';
import { useQuery } from 'react-query';
import { AddressStateEntity } from '../../entities/AddressStateEntity';
import { useRepository } from '../../hooks/useRepository';
import { UserRepository } from '../../repositories/UserRepository';

interface Props {
    canGoBack: boolean;
}

export const NewAddressForm = forwardRef<unknown, Props>(function NewAddressForm({ canGoBack }, ref) {
    const userRepository = useRepository(UserRepository);
    const formik = useFormikContext<Record<string, any>>();
    const address = formik.values.address;
    const states = useQuery('customer/addresses/states', () => userRepository.getAddressStates());

    const handleBack = useCallback(() => {
        if (canGoBack) {
            formik.setFieldValue('newAddress', false);
            formik.setFieldValue('address', formik.values.backup);
        }
    }, [canGoBack, formik]);

    return (
        <Stack ref={ref}>
            <Grid container alignItems={'center'}>
                {canGoBack ? (
                    <IconButton onClick={handleBack}>
                        <ArrowBack />
                    </IconButton>
                ) : null}
                <Typography variant={'subtitle1'} fontWeight={500} ml={1}>
                    New Shipping Address
                </Typography>
            </Grid>

            <Grid container spacing={3} mt={'1px'}>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label={'First Name'}
                        name={'address.firstName'}
                        value={address.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label={'Last Name'}
                        name={'address.lastName'}
                        value={address.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Grid>

                <Grid item xs={9}>
                    <TextField
                        fullWidth
                        label={'Address'}
                        name={'address.address'}
                        value={address.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        fullWidth
                        label={'Apt #'}
                        name={'address.flat'}
                        value={address.flat}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        label={'City'}
                        name={'address.city'}
                        value={address.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel id={'states-list'}>State</InputLabel>
                        <Select
                            fullWidth
                            labelId={'states-list'}
                            label={'State'}
                            name={'address.state'}
                            value={address.state || 'none'}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            variant={'outlined'}
                        >
                            <MenuItem value="none">Select a state</MenuItem>
                            {states.data?.map((item: AddressStateEntity) => (
                                <MenuItem key={item.id} value={item.code}>
                                    {item.code}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        label={'Zip Code'}
                        name={'address.zip'}
                        value={address.zip}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Grid>

                <Grid item xs={12}>
                    <NumberFormat
                        fullWidth
                        customInput={TextField}
                        format="+1 (###) ###-####"
                        placeholder={'Enter Phone Number'}
                        variant={'outlined'}
                        label={'Phone Number'}
                        name={'address.phone'}
                        value={address.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Grid>
            </Grid>
        </Stack>
    );
});
