import HomeTwoTone from '@mui/icons-material/HomeTwoTone';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
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
    newAddressBtn: {
        borderRadius: 24,
        padding: '12px 24px',
        [theme.breakpoints.down('sm')]: {
            marginLeft: 'auto',
            padding: '9px 16px',
        },
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
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const [isLoading, setIsLoading] = useState(false);
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
            (async () => {
                try {
                    setIsLoading(true);
                    await dispatch(getSavedAddresses());
                    await dispatch(getCountriesList());
                    await dispatch(getStatesList());
                } finally {
                    setIsLoading(false);
                }
            })();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const $newAddress = (
        <Button
            className={classes.newAddressBtn}
            variant={'contained'}
            color={'primary'}
            onClick={() => setShowAddAddressModal(true)}
        >
            Add Address
        </Button>
    );

    if (isLoading) {
        return (
            <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <ListHeader headline={'Address Book'} noSearch actions={isMobile ? $newAddress : null}>
                {!isMobile ? $newAddress : null}
            </ListHeader>
            {existingAddresses.length > 0 && !isLoading ? (
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
                                address2={address.address2}
                                city={address.city}
                                country={address.country}
                                state={address.state}
                                stateName={address?.stateName}
                                id={address.id}
                                zip={address.zipCode}
                                phone={address.phoneNumber}
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
