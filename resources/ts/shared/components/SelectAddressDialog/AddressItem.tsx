import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useFormikContext } from 'formik';
import { useCallback } from 'react';
import { AddressEntity } from '../../entities/AddressEntity';

interface Props {
    address: AddressEntity;
}

export function AddressItem({ address }: Props) {
    const formik = useFormikContext<Record<string, any>>();
    const selectedAddressId = formik.values.address?.id;

    const handleClick = useCallback(() => formik.setFieldValue('address', address), [formik, address]);

    return (
        <Root onClick={handleClick}>
            <Grid container alignItems={'flex-start'} justifyContent={'flex-start'} py={2} px={1.5}>
                <Radio checked={address.id === selectedAddressId} sx={{ p: 0 }} />
                <Grid
                    container
                    item
                    xs
                    direction={'column'}
                    alignItems={'flex-start'}
                    justifyContent={'flex-start'}
                    flexGrow={1}
                    pl={1.5}
                >
                    <Typography variant={'body2'} align={'left'}>
                        {address.getFullName()}
                    </Typography>
                    <Typography variant={'body2'} align={'left'}>
                        {address.getAddress()}
                    </Typography>
                    <Typography variant={'body2'} align={'left'}>
                        {address.getAddressLine2()}
                    </Typography>
                    {address.phone && (
                        <Typography variant={'body2'} align={'left'}>
                            {address.phone}
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Root>
    );
}

const Root = styled(ButtonBase)({
    border: '1px solid #ddd',
    borderRadius: 0.5,
    width: '100%',
});
