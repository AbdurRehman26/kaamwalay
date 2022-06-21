import HomeTwoTone from '@mui/icons-material/HomeTwoTone';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useEffect, useState } from 'react';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { APIService } from '@shared/services/APIService';
import { ListHeader } from '../../components/ListHeader/ListHeader';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getCountriesList, getSavedAddresses, getStatesList } from '../../redux/slices/newAddressSlice';
import { AddAddressDialog } from './AddAddressDialog';
import { Address } from './Address';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
    },
}));

const StyledBox = styled(Box)(
    {
        width: '100%',
        backgroundColor: '#F9F9F9',
        border: '1px solid #E0E0E0',
        borderRadius: '8px',
        padding: '40px 20px',
    },
    { name: 'StyledBox' },
);

export function ListAddresses() {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const apiService = useInjectable(APIService);
    const notifications = useNotifications();

    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const existingAddresses = useAppSelector((state) => state.newAddressSlice.existingAddresses);

    const handleAddressDeleteSubmit = async (id: string) => {
        try {
            const endpoint = apiService.createEndpoint(`customer/addresses/${id}`);
            await endpoint.delete('');
            notifications.success('Deleted Successfully!');
            dispatch(getSavedAddresses());
        } catch (e: any) {
            notifications.exception(e);
        }
    };

    const loadAddresses = () => {
        dispatch(getSavedAddresses());
    };

    useEffect(
        () => {
            dispatch(getSavedAddresses());
            dispatch(getCountriesList());
            dispatch(getStatesList());
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const $newAddress = (
        <Button variant={'contained'} color={'primary'} onClick={() => setShowAddAddressModal(true)}>
            Add Address
        </Button>
    );

    return (
        <>
            <ListHeader headline={'Address Book'} noSearch>
                {$newAddress}
            </ListHeader>
            {existingAddresses.length > 0 ? (
                <>
                    <Typography variant={'caption'} color={'rgba(0, 0, 0, 0.54)'}>
                        OTHER ADDRESSES
                    </Typography>
                    <Box marginBottom={'16px'} />
                    <div className={classes.container}>
                        {existingAddresses?.map((address: any) => (
                            <Address
                                key={address.id}
                                firstName={address.firstName}
                                lastName={address.lastName}
                                address={address.address}
                                flat={address.flat ?? ''}
                                city={address.city}
                                country={address.country}
                                state={address.state}
                                stateName={address?.stateName}
                                id={address.id}
                                zip={address.zip}
                                phone={address.phone}
                                handleAddressDeleteSubmit={handleAddressDeleteSubmit}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <StyledBox>
                    <Grid container alignItems={'center'} justifyContent={'center'} rowSpacing={1}>
                        <Grid item xs={12} container justifyContent={'center'} alignContent={'center'}>
                            <HomeTwoTone />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant={'subtitle1'} fontWeight={500} textAlign={'center'} fontSize={16}>
                                No Saved Addresses
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant={'body1'} textAlign={'center'} fontSize={12}>
                                Click Add Address to add an
                                <br />
                                address to your list.
                            </Typography>
                        </Grid>
                    </Grid>
                </StyledBox>
            )}
            <AddAddressDialog
                dialogTitle={'Add Shipping Address'}
                isUpdate={false}
                open={showAddAddressModal}
                onClose={() => setShowAddAddressModal(false)}
                onSubmit={() => loadAddresses()}
            />
        </>
    );
}
