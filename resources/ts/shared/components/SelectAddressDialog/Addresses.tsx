import Grid from '@mui/material/Grid';
import { AddressEntity } from '../../entities/AddressEntity';
import { AddressItem } from './AddressItem';

interface Props {
    addresses: AddressEntity[];
}

export function Addresses({ addresses }: Props) {
    return (
        <Grid container spacing={3} mb={3}>
            {addresses?.map((address, index) => (
                <Grid item xs={12} sm={6} key={index}>
                    <AddressItem address={address} />
                </Grid>
            ))}
        </Grid>
    );
}
